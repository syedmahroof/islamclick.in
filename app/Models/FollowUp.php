<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class FollowUp extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'type',
        'description',
        'scheduled_at',
        'status',
        'outcome',
        'user_id',
        'assigned_to'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function followable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
