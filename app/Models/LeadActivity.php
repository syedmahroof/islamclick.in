<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadActivity extends Model
{
    use HasFactory;

    protected $table = 'lead_activity_logs';

    protected $fillable = [
        'lead_id',
        'user_id',
        'type',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user that caused the activity.
     * This is an alias of the user() relationship for compatibility with activity log packages.
     */
    public function causer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
