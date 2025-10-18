<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class BookingRoom extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_id',
        'hotel_room_id',
        'room_number',
        'room_type',
        'quantity',
        'adults',
        'children',
        'extra_beds',
        'price_per_night',
        'extra_bed_price',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'currency',
        'status',
        'check_in',
        'check_out',
        'check_in_time',
        'check_out_time',
        'special_requests',
        'guest_info',
        'cancellation_policy',
        'cancelled_at',
        'cancellation_reason',
        'cancelled_by'
    ];

    protected $casts = [
        'price_per_night' => 'float',
        'extra_bed_price' => 'float',
        'discount_amount' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'guest_info' => 'array',
        'cancellation_policy' => 'array',
        'check_in' => 'date',
        'check_out' => 'date',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'cancelled_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Status constants
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_CHECKED_IN = 'checked_in';
    public const STATUS_CHECKED_OUT = 'checked_out';
    public const STATUS_NO_SHOW = 'no_show';

    /**
     * Get the booking that owns the booking room.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the hotel room that was booked.
     */
    public function hotelRoom(): BelongsTo
    {
        return $this->belongsTo(HotelRoom::class);
    }

    /**
     * Get the user who cancelled the booking room.
     */
    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    /**
     * Get the number of nights for the booking.
     */
    public function getNightsAttribute(): int
    {
        return Carbon::parse($this->check_in)->diffInDays(Carbon::parse($this->check_out));
    }

    /**
     * Calculate the total amount for the booking room.
     */
    public function calculateTotal(): float
    {
        $nights = $this->getNightsAttribute();
        $roomTotal = $this->price_per_night * $nights * $this->quantity;
        $extraBedsTotal = $this->extra_bed_price * $this->extra_beds * $nights;
        
        return $roomTotal + $extraBedsTotal - $this->discount_amount + $this->tax_amount;
    }

    /**
     * Check if the booking room can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        if ($this->status === self::STATUS_CANCELLED || 
            $this->status === self::STATUS_CHECKED_OUT) {
            return false;
        }

        $now = now();
        $checkIn = Carbon::parse($this->check_in);
        
        // Check if check-in date is in the future
        if ($now->greaterThanOrEqualTo($checkIn)) {
            return false;
        }

        // Check cancellation policy
        $cancellationPolicy = $this->cancellation_policy;
        if (empty($cancellationPolicy)) {
            return true;
        }

        // Check if free cancellation is allowed based on policy
        $freeCancellationDays = $cancellationPolicy['free_cancellation_before_days'] ?? 0;
        $cancellationDeadline = $checkIn->copy()->subDays($freeCancellationDays);
        
        return $now->lessThanOrEqualTo($cancellationDeadline);
    }

    /**
     * Get the cancellation fee amount.
     */
    public function getCancellationFee(): float
    {
        if ($this->canBeCancelled()) {
            return 0;
        }

        $cancellationPolicy = $this->cancellation_policy;
        if (empty($cancellationPolicy)) {
            return $this->total_amount;
        }

        $refundPercentage = $cancellationPolicy['refund_percentage'] ?? 0;
        $cancellationFee = $this->total_amount * (1 - ($refundPercentage / 100));
        
        return max(0, $cancellationFee);
    }

    /**
     * Scope a query to only include confirmed bookings.
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    /**
     * Scope a query to only include active bookings (not cancelled or checked out).
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_CANCELLED, self::STATUS_CHECKED_OUT]);
    }

    /**
     * Scope a query to only include bookings for a specific date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->where(function($q) use ($startDate, $endDate) {
            $q->whereBetween('check_in', [$startDate, $endDate])
              ->orWhereBetween('check_out', [$startDate, $endDate])
              ->orWhere(function($q) use ($startDate, $endDate) {
                  $q->where('check_in', '<=', $startDate)
                    ->where('check_out', '>=', $endDate);
              });
        });
    }

    /**
     * Get the guest information as an array.
     */
    public function getGuestInfoArrayAttribute(): array
    {
        return $this->guest_info ?? [];
    }

    /**
     * Get the primary guest name.
     */
    public function getPrimaryGuestNameAttribute(): string
    {
        $guestInfo = $this->guest_info;
        if (empty($guestInfo) || !isset($guestInfo['primary_guest'])) {
            return 'Unknown Guest';
        }

        $primaryGuest = $guestInfo['primary_guest'];
        return trim($primaryGuest['first_name'] . ' ' . ($primaryGuest['last_name'] ?? ''));
    }
}
