<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'en_name',
        'slug',
        'description',
        'is_active',
        'order',
        'icon',
        'parent_id',
        'meta_title',
        'meta_description',
    ];

    /**
     * The attributes that should be visible in arrays.
     *
     * @var array<int, string>
     */
    protected $visible = [
        'id',
        'name',
        'en_name',
        'slug',
        'description',
        'is_active',
        'order',
        'icon',
        'parent_id',
        'meta_title',
        'meta_description',
        'url',
        'has_children',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'parent_id' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'url',
        'has_children',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Set default order by order field
        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('order');
        });

        // Auto-generate slug if not provided
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = \Illuminate\Support\Str::slug($category->en_name ?? $category->name);
            }
        });

        // Auto-update slug if name changes
        static::updating(function ($category) {
            if ($category->isDirty('name') || $category->isDirty('en_name')) {
                if (empty($category->slug)) {
                    $category->slug = \Illuminate\Support\Str::slug($category->en_name ?? $category->name);
                }
            }
        });
    }

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->with('children');
    }

    /**
     * Get all descendant categories.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function descendants(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')
            ->with('descendants');
    }

    /**
     * Get all descendant category IDs including nested ones.
     */
    public function getDescendantIds(): array
    {
        $ids = [];
        $children = $this->children()->select('id')->get();
        
        foreach ($children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $child->getDescendantIds());
        }
        
        return $ids;
    }

    /**
     * Check if category has active children.
     */
    public function getHasChildrenAttribute(): bool
    {
        return $this->children()->exists();
    }
    
    /**
     * Scope a query to include all descendants.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithDescendants(Builder $query): Builder
    {
        return $query->with(['children' => function($query) {
            $query->with('descendants');
        }]);
    }

    /**
     * Get all articles for the category.
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
    
    /**
     * Get only published articles for the category.
     */
    public function publishedArticles(): HasMany
    {
        return $this->hasMany(Article::class)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Get the subcategories for the category.
     * This is kept for backward compatibility but consider using children() instead.
     */
    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class)->orderBy('order');
    }

    /**
     * Get the URL to the category.
     */
    public function getUrlAttribute(): ?string
    {
        if (empty($this->slug)) {
            return null;
        }
        return route('categories.show', $this->slug);
    }

    /**
     * Scope a query to only include active categories.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include root categories (no parent).
     */
    public function scopeRoot(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id';
    }

    /**
     * Get all categories in tree structure.
     */
    public static function getTree(): \Illuminate\Database\Eloquent\Collection
    {
        return static::with('children')
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();
    }
    
    /**
     * Check if the category has any active children.
     *
     * @return bool
     */
    public function hasActiveChildren(): bool
    {
        return $this->children()
            ->where('is_active', true)
            ->exists();
    }
}
