<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\User;
use App\Models\Booking;

class Review extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'rating',
        'is_approved',
        'approved_by',
        'approved_at',
        'user_id',
        'reviewable_type',
        'reviewable_id',
        'booking_id',
        'trip_date',
        'traveller_type',
        'trip_type',
        'helpful_count',
        'status',
        'response',
        'responded_by',
        'responded_at',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'trip_date' => 'date',
        'helpful_count' => 'integer',
        'responded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user that owns the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent reviewable model (Package, Hotel, Destination, etc.).
     */
    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the booking associated with the review.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who approved the review.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the user who responded to the review.
     */
    public function respondedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    /**
     * Scope a query to only include approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope a query to only include pending reviews.
     */
    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    /**
     * Mark the review as approved.
     */
    public function approve(int $approvedBy): bool
    {
        return $this->update([
            'is_approved' => true,
            'approved_by' => $approvedBy,
            'approved_at' => now(),
        ]);
    }

    /**
     * Add a response to the review.
     */
    public function addResponse(string $response, int $respondedBy): bool
    {
        return $this->update([
            'response' => $response,
            'responded_by' => $respondedBy,
            'responded_at' => now(),
        ]);
    }

    /**
     * Increment the helpful count for the review.
     */
    public function markAsHelpful(): bool
    {
        return $this->increment('helpful_count');
    }
}
