<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Source extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'url',
        'author',
        'publisher',
        'published_date',
        'description'
    ];

    protected $casts = [
        'published_date' => 'date'
    ];

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_source')
            ->withPivot('context', 'order')
            ->withTimestamps();
    }
}
