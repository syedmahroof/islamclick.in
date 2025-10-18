<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subcategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
        'parent_id',
        'is_active',
        'order',
        'icon'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'category_id' => 'integer',
        'parent_id' => 'integer'
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug if not provided
        static::creating(function ($subcategory) {
            if (empty($subcategory->slug)) {
                $subcategory->slug = \Illuminate\Support\Str::slug($subcategory->name);
            }
        });

        // Auto-update slug if name changes
        static::updating(function ($subcategory) {
            if ($subcategory->isDirty('name')) {
                if (empty($subcategory->slug)) {
                    $subcategory->slug = \Illuminate\Support\Str::slug($subcategory->name);
                }
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function parent()
    {
        return $this->belongsTo(Subcategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Subcategory::class, 'parent_id')->orderBy('order');
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
