<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    public static function log(string $action, string $model, $modelId = null, ?string $description = null, ?array $oldValues = null, ?array $newValues = null)
    {
        return ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model' => $model,
            'model_id' => $modelId,
            'description' => $description ?? self::generateDescription($action, $model, $modelId),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    private static function generateDescription(string $action, string $model, $modelId): string
    {
        $userName = Auth::user() ? Auth::user()->name : 'System';
        
        $actions = [
            'created' => 'created',
            'updated' => 'updated',
            'deleted' => 'deleted',
            'published' => 'published',
            'unpublished' => 'unpublished',
        ];

        $actionText = $actions[$action] ?? $action;
        
        return "{$userName} {$actionText} {$model}" . ($modelId ? " #{$modelId}" : '');
    }

    public static function created(string $model, $modelId, array $attributes = [])
    {
        return self::log('created', $model, $modelId, null, null, $attributes);
    }

    public static function updated(string $model, $modelId, array $oldAttributes = [], array $newAttributes = [])
    {
        return self::log('updated', $model, $modelId, null, $oldAttributes, $newAttributes);
    }

    public static function deleted(string $model, $modelId, array $attributes = [])
    {
        return self::log('deleted', $model, $modelId, null, $attributes, null);
    }

    public static function published(string $model, $modelId)
    {
        return self::log('published', $model, $modelId, "Published {$model} #{$modelId}");
    }

    public static function unpublished(string $model, $modelId)
    {
        return self::log('unpublished', $model, $modelId, "Unpublished {$model} #{$modelId}");
    }
}

