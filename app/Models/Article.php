<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'seo_title',
        'seo_description',
        'body',
        'category_id',
        'subcategory_id',
        'author_id',
        'featured_image_id',
        'is_published',
        'published_at',
        'views',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'meta_title',
        'meta_description',
        'is_featured',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'views' => 'integer',
        'category_id' => 'integer',
        'subcategory_id' => 'integer',
        'author_id' => 'integer',
        'featured_image_id' => 'integer',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug if not provided
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = \Illuminate\Support\Str::slug($article->title);
            }
        });

        // Auto-update slug if title changes
        static::updating(function ($article) {
            if ($article->isDirty('title')) {
                if (empty($article->slug)) {
                    $article->slug = \Illuminate\Support\Str::slug($article->title);
                }
            }
        });
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['featured_image_url', 'status', 'read_time'];
    
    /**
     * The attributes that should be visible in arrays.
     *
     * @var array
     */
    protected $visible = [
        'id', 'title', 'slug', 'seo_title', 'seo_description', 'body', 'excerpt', 'content',
        'category_id', 'subcategory_id', 'author_id', 'featured_image_id', 'featured_image',
        'is_published', 'is_featured', 'published_at', 'views', 'status', 'meta_title', 'meta_description',
        'created_at', 'updated_at', 'deleted_at', 'featured_image_url', 'read_time',
        'category', 'subcategory', 'author', 'featuredImage', 'tags', 'sources', 'references'
    ];

    /**
     * Get the category that owns the article.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the subcategory that owns the article.
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    /**
     * Get the user that owns the article.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    /**
     * The sources that belong to the article.
     */
    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(Source::class, 'article_source')
            ->withPivot('context', 'order')
            ->withTimestamps();
    }

    /**
     * Get the featured image that owns the article.
     */
    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    /**
     * Get the images that belong to the article.
     */
    public function images()
    {
        return $this->morphMany(Media::class, 'model');
    }

    /**
     * The tags that belong to the article.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    /**
     * Get the comments for the article.
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    /**
     * Get the references for the article.
     */
    public function references(): HasMany
    {
        return $this->hasMany(Reference::class)->orderBy('order');
    }

    /**
     * Scope a query to only include published articles.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include featured articles.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include draft articles.
     */
    public function scopeDraft($query)
    {
        return $query->where('is_published', false);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the status of the article.
     *
     * @return string Returns 'draft', 'published', or 'archived'
     */
    public function getStatusAttribute(): string
    {
        if (!$this->is_published) {
            return 'draft';
        }
        
        // Treat scheduled articles as 'draft' for the frontend
        if ($this->published_at && $this->published_at->isFuture()) {
            return 'draft';
        }
        
        // Check if the article is archived (you may want to add an 'is_archived' column)
        // For now, we'll assume no articles are archived
        return 'published';
    }

    /**
     * Get the URL to the article's featured image.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if ($this->featuredImage) {
            return $this->featuredImage->url;
        }
        
        // Fallback to the old featured_image field if it exists
        if (property_exists($this, 'featured_image') && $this->featured_image) {
            return asset('storage/' . $this->featured_image);
        }

        return null;
    }

    /**
     * Get the estimated reading time for the article.
     *
     * @return int Reading time in minutes
     */
    public function getReadTimeAttribute(): int
    {
        // Get the content to analyze
        $content = $this->body ?? $this->content ?? '';
        
        // Remove HTML tags and get word count
        $text = strip_tags($content);
        
        // For Malayalam and other Unicode text, use character count instead of word count
        // Remove extra whitespace and count characters
        $text = preg_replace('/\s+/', ' ', trim($text));
        $characterCount = mb_strlen($text, 'UTF-8');
        
        // For Malayalam text, estimate 3-4 characters per word
        // Average reading speed is 200-250 words per minute
        // We'll use 225 words per minute for calculation
        $wordsPerMinute = 225;
        $charactersPerWord = 3.5; // Average for Malayalam
        $wordCount = $characterCount / $charactersPerWord;
        
        // Calculate reading time
        $readTime = ceil($wordCount / $wordsPerMinute);
        
        // Minimum reading time is 1 minute
        return max(1, $readTime);
    }
}
