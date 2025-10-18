<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class File extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'path',
        'mime_type',
        'size',
        'user_id'
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
