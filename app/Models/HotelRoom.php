<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\DB;

class HotelRoom extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'hotel_id',
        'room_type',
        'name',
        'description',
        'max_occupancy',
        'max_adults',
        'max_children',
        'size_sqm',
        'bed_type',
        'bed_count',
        'price_per_night',
        'extra_bed_price',
        'room_count',
        'available_rooms',
        'amenities',
        'images',
        'is_smoking_allowed',
        'is_refundable',
        'cancellation_policy',
        'min_nights',
        'max_nights',
        'display_order',
        'is_active'
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'price_per_night' => 'float',
        'extra_bed_price' => 'float',
        'is_smoking_allowed' => 'boolean',
        'is_refundable' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the hotel that owns the room.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * Get the bookings for the room.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(BookingRoom::class);
    }

    /**
     * Get the room's images with full URLs.
     */
    public function getImageUrlsAttribute(): array
    {
        if (empty($this->images)) {
            return [];
        }

        return array_map(function ($image) {
            return asset('storage/' . $image);
        }, $this->images);
    }

    /**
     * Get the room's featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (empty($this->images)) {
            return null;
        }
        
        return asset('storage/' . $this->images[0]);
    }

    /**
     * Scope a query to only include active rooms.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if the room is available for the given dates.
     */
    public function isAvailableForDates($checkIn, $checkOut, $roomCount = 1): bool
    {
        $bookedRooms = $this->bookings()
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut->copy()->subDay()])
                    ->orWhereBetween('check_out', [$checkIn->copy()->addDay(), $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                    });
            })
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->sum('quantity');

        return ($this->room_count - $bookedRooms) >= $roomCount;
    }

    /**
     * Get the number of available rooms for the given dates.
     */
    public function getAvailableRoomsForDates($checkIn, $checkOut): int
    {
        $bookedRooms = $this->bookings()
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut->copy()->subDay()])
                    ->orWhereBetween('check_out', [$checkIn->copy()->addDay(), $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                    });
            })
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->sum('quantity');

        return max(0, $this->room_count - $bookedRooms);
    }

    /**
     * Get the total price for a stay.
     */
    public function getTotalPrice($checkIn, $checkOut, $adults = 1, $children = 0, $extraBeds = 0): float
    {
        $nights = $checkIn->diffInDays($checkOut);
        $basePrice = $this->price_per_night * $nights;
        $extraBedPrice = $this->extra_bed_price ? $this->extra_bed_price * $extraBeds * $nights : 0;
        
        return $basePrice + $extraBedPrice;
    }

    /**
     * Get the cancellation policy as an array.
     */
    public function getCancellationPolicyArrayAttribute(): array
    {
        if (empty($this->cancellation_policy)) {
            return [
                'free_cancellation_before_days' => 1,
                'refund_percentage' => 100,
                'no_show_charge_percentage' => 100,
            ];
        }

        return json_decode($this->cancellation_policy, true);
    }
}
