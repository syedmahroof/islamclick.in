<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Author extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'bio',
        'email',
        'website',
        'twitter_handle',
        'facebook_username',
        'linkedin_profile',
        'profile_image_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug if not provided
        static::creating(function ($author) {
            if (empty($author->slug)) {
                $author->slug = \Illuminate\Support\Str::slug($author->name);
            }
        });

        // Auto-update slug if name changes
        static::updating(function ($author) {
            if ($author->isDirty('name')) {
                if (empty($author->slug)) {
                    $author->slug = \Illuminate\Support\Str::slug($author->name);
                }
            }
        });
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function profileImage()
    {
        return $this->belongsTo(Media::class, 'profile_image_id');
    }

    /**
     * Get the profile photo URL.
     */
    public function getProfilePhotoUrlAttribute()
    {
        return $this->profileImage?->url;
    }
}
