<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Hotel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'destination_id',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'phone',
        'email',
        'website',
        'check_in_time',
        'check_out_time',
        'star_rating',
        'featured_image',
        'gallery',
        'amenities',
        'is_featured',
        'is_active',
        'policies',
        'cancellation_policy',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'created_by'
    ];

    protected $casts = [
        'gallery' => 'array',
        'amenities' => 'array',
        'star_rating' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($hotel) {
            if (empty($hotel->slug)) {
                $hotel->slug = Str::slug($hotel->name);
            }
        });

        static::updating(function ($hotel) {
            if ($hotel->isDirty('name') && empty($hotel->slug)) {
                $hotel->slug = Str::slug($hotel->name);
            }
        });
    }

    /**
     * Get the destination that owns the hotel.
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    /**
     * Get the user who created the hotel.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all the hotel's reviews.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the packages that include this hotel.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'hotel_package')
            ->withPivot(['night_number', 'display_order'])
            ->withTimestamps();
    }

    /**
     * Get the hotel's rooms.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(HotelRoom::class);
    }

    /**
     * Get the hotel's featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (!$this->featured_image) {
            return null;
        }
        
        return asset('storage/' . $this->featured_image);
    }

    /**
     * Get the hotel's gallery images with full URLs.
     */
    public function getGalleryUrlsAttribute(): array
    {
        if (empty($this->gallery)) {
            return [];
        }

        return array_map(function ($image) {
            return asset('storage/' . $image);
        }, $this->gallery);
    }

    /**
     * Get the hotel's amenities as an array.
     */
    public function getAmenitiesListAttribute(): array
    {
        if (empty($this->amenities)) {
            return [];
        }

        return $this->amenities;
    }

    /**
     * Scope a query to only include active hotels.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured hotels.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get the average rating of the hotel.
     */
    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    /**
     * Get the total number of reviews for the hotel.
     */
    public function getTotalReviewsAttribute(): int
    {
        return $this->reviews()->count();
    }

    /**
     * Get the starting price of the hotel's rooms.
     */
    public function getStartingPriceAttribute()
    {
        $cheapestRoom = $this->rooms()->orderBy('price_per_night', 'asc')->first();
        
        return $cheapestRoom ? $cheapestRoom->price_per_night : 0;
    }
}
