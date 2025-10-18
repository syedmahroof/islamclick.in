<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Attraction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'destination_id',
        'location',
        'latitude',
        'longitude',
        'featured_image',
        'gallery',
        'opening_hours',
        'entrance_fee',
        'contact_phone',
        'contact_email',
        'website',
        'is_featured',
        'is_active',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'display_order',
        'created_by'
    ];

    protected $casts = [
        'gallery' => 'array',
        'entrance_fee' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
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

        static::creating(function ($attraction) {
            if (empty($attraction->slug)) {
                $attraction->slug = Str::slug($attraction->name);
            }
        });

        static::updating(function ($attraction) {
            if ($attraction->isDirty('name') && empty($attraction->slug)) {
                $attraction->slug = Str::slug($attraction->name);
            }
        });
    }

    /**
     * Get the destination that owns the attraction.
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    /**
     * Get the user who created the attraction.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all the attraction's reviews.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the packages that include this attraction.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_attraction')
            ->withPivot('display_order')
            ->withTimestamps();
    }

    /**
     * Get the attraction's featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (!$this->featured_image) {
            return null;
        }
        
        return asset('storage/' . $this->featured_image);
    }

    /**
     * Get the attraction's gallery images with full URLs.
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
     * Scope a query to only include active attractions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured attractions.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get the average rating of the attraction.
     */
    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    /**
     * Get the total number of reviews for the attraction.
     */
    public function getTotalReviewsAttribute(): int
    {
        return $this->reviews()->count();
    }

    /**
     * Get the opening hours as an array.
     */
    public function getOpeningHoursArrayAttribute(): array
    {
        if (empty($this->opening_hours)) {
            return [];
        }

        return json_decode($this->opening_hours, true) ?? [];
    }

    /**
     * Check if the attraction is open now.
     */
    public function getIsOpenNowAttribute(): bool
    {
        $now = now();
        $dayOfWeek = strtolower($now->englishDayOfWeek);
        $currentTime = $now->format('H:i');
        
        $openingHours = $this->opening_hours_array;
        
        if (!isset($openingHours[$dayOfWeek]) || !$openingHours[$dayOfWeek]['is_open']) {
            return false;
        }
        
        return $currentTime >= $openingHours[$dayOfWeek]['open'] && 
               $currentTime <= $openingHours[$dayOfWeek]['close'];
    }
}
