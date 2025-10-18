<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Country;
use App\Models\State;
use App\Models\User;
use App\Models\Attraction;
use App\Models\Hotel;
use App\Models\Package;
use App\Models\Review;

class Destination extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'country_id',
        'state_id',
        'location',
        'latitude',
        'longitude',
        'featured_image',
        'gallery',
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
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the country that owns the destination.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the state that owns the destination.
     */
    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    /**
     * Get the user who created the destination.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the attractions for the destination.
     */
    public function attractions(): HasMany
    {
        return $this->hasMany(Attraction::class);
    }

    /**
     * Get the hotels for the destination.
     */
    public function hotels(): HasMany
    {
        return $this->hasMany(Hotel::class);
    }

    /**
     * Get the packages for the destination.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_destination')
            ->withPivot('display_order')
            ->withTimestamps();
    }

    /**
     * Get all the destination's reviews.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the destination's featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (!$this->featured_image) {
            return null;
        }
        
        return asset('storage/' . $this->featured_image);
    }

    /**
     * Get the destination's gallery images with full URLs.
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
     * Scope a query to only include active destinations.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured destinations.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get the average rating of the destination.
     */
    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    /**
     * Get the total number of reviews for the destination.
     */
    public function getTotalReviewsAttribute(): int
    {
        return $this->reviews()->count();
    }
}
