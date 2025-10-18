<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'file_name',
        'mime_type',
        'path',
        'disk',
        'size',
        'manipulations',
        'custom_properties',
        'collection_name',
        'order_column',
        'alt_text',
        'caption'
    ];

    protected $casts = [
        'manipulations' => 'array',
        'custom_properties' => 'array',
        'size' => 'integer',
        'order_column' => 'integer'
    ];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        if ($this->disk === 'public') {
            return asset('storage/' . $this->path);
        }
        
        return asset($this->path);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->hasGeneratedConversion('thumb')) {
            return $this->getUrl('thumb');
        }

        return $this->getUrl();
    }

    public function getExtensionAttribute(): string
    {
        return pathinfo($this->file_name, PATHINFO_EXTENSION);
    }

    public function getHumanReadableSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
