<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reference extends Model
{
    protected $fillable = [
        'article_id',
        'title',
        'link',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the article that owns the reference.
     */
    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
