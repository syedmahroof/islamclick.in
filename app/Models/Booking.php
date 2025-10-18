<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_reference',
        'package_id',
        'user_id',
        'lead_person_id',
        'start_date',
        'end_date',
        'adults',
        'children',
        'total_amount',
        'discount_amount',
        'tax_amount',
        'grand_total',
        'status',
        'special_requests',
        'cancellation_reason',
        'cancelled_by',
        'cancelled_at',
        'created_by'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'cancelled_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the package that owns the booking.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * Get the user that owns the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lead person associated with the booking.
     */
    public function leadPerson(): BelongsTo
    {
        return $this->belongsTo(LeadPerson::class);
    }

    /**
     * Get the user who cancelled the booking.
     */
    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    /**
     * Get the user who created the booking.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the payments for the booking.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the rooms booked in this booking.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(BookingRoom::class);
    }

    /**
     * Get the latest payment for the booking.
     */
    public function latestPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    /**
     * Get the reviews for the booking.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the booking participants.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(BookingParticipant::class);
    }

    /**
     * Get the booking status history.
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(BookingStatusHistory::class);
    }
}
