<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Package extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'duration_days',
        'duration_nights',
        'start_date',
        'end_date',
        'price_per_person',
        'discount_percentage',
        'discount_start_date',
        'discount_end_date',
        'min_people',
        'max_people',
        'is_featured',
        'is_active',
        'featured_image',
        'gallery',
        'included',
        'excluded',
        'itinerary',
        'terms_conditions',
        'cancellation_policy',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'discount_start_date' => 'date',
        'discount_end_date' => 'date',
        'price_per_person' => 'float',
        'discount_percentage' => 'float',
        'min_people' => 'integer',
        'max_people' => 'integer',
        'duration_days' => 'integer',
        'duration_nights' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'gallery' => 'array',
        'included' => 'array',
        'excluded' => 'array',
        'itinerary' => 'array',
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

        static::creating(function ($package) {
            if (empty($package->slug)) {
                $package->slug = Str::slug($package->name);
            }
        });

        static::updating(function ($package) {
            if ($package->isDirty('name') && empty($package->slug)) {
                $package->slug = Str::slug($package->name);
            }
        });
    }

    /**
     * Get the destinations included in this package.
     */
    public function destinations(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class, 'package_destination')
            ->withPivot(['display_order', 'nights', 'is_highlighted'])
            ->withTimestamps();
    }

    /**
     * Get the attractions included in this package.
     */
    public function attractions(): BelongsToMany
    {
        return $this->belongsToMany(Attraction::class, 'package_attraction')
            ->withPivot(['display_order', 'visit_date', 'is_included'])
            ->withTimestamps();
    }

    /**
     * Get the hotels included in this package.
     */
    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class, 'package_hotel')
            ->withPivot(['nights', 'room_type', 'meal_plan', 'check_in_date', 'check_out_date', 'display_order'])
            ->withTimestamps();
    }

    /**
     * Get the bookings for this package.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the reviews for the package.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the user who created the package.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated the package.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the package's featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (!$this->featured_image) {
            return null;
        }
        
        return asset('storage/' . $this->featured_image);
    }

    /**
     * Get the package's gallery images with full URLs.
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
     * Get the discounted price per person.
     */
    public function getDiscountedPriceAttribute(): float
    {
        if (!$this->isOnDiscount()) {
            return $this->price_per_person;
        }

        return $this->price_per_person * (1 - ($this->discount_percentage / 100));
    }

    /**
     * Check if the package is on discount.
     */
    public function isOnDiscount(): bool
    {
        if (!$this->discount_percentage || $this->discount_percentage <= 0) {
            return false;
        }

        $now = now();
        
        if ($this->discount_start_date && $now->lt($this->discount_start_date)) {
            return false;
        }

        if ($this->discount_end_date && $now->gt($this->discount_end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Get the package duration as a string.
     */
    public function getDurationAttribute(): string
    {
        if ($this->duration_nights > 0) {
            return $this->duration_nights . ' Nights / ' . ($this->duration_nights + 1) . ' Days';
        }
        
        return $this->duration_days . ' Days';
    }

    /**
     * Scope a query to only include active packages.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured packages.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include packages with a discount.
     */
    public function scopeOnDiscount($query)
    {
        $now = now();
        
        return $query->where('discount_percentage', '>', 0)
            ->where(function($q) use ($now) {
                $q->whereNull('discount_start_date')
                  ->orWhere('discount_start_date', '<=', $now);
            })
            ->where(function($q) use ($now) {
                $q->whereNull('discount_end_date')
                  ->orWhere('discount_end_date', '>=', $now);
            });
    }

    /**
     * Get the average rating of the package.
     */
    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    /**
     * Get the total number of reviews for the package.
     */
    public function getTotalReviewsAttribute(): int
    {
        return $this->reviews()->count();
    }

    /**
     * Get the package's itinerary as an array.
     */
    public function getItineraryArrayAttribute(): array
    {
        if (empty($this->itinerary)) {
            return [];
        }

        return is_array($this->itinerary) ? $this->itinerary : json_decode($this->itinerary, true);
    }
}
