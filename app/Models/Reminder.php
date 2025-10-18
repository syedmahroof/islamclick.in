<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Reminder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'reminder_date',
        'is_completed',
        'user_id'
    ];

    protected $casts = [
        'reminder_date' => 'datetime',
        'is_completed' => 'boolean',
    ];

    public function remindable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
