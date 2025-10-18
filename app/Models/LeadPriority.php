<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeadPriority extends Model
{
    protected $fillable = [
        'name',
        'description',
        'level',
        'color',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'level' => 'integer',
    ];

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Ensure only one default priority exists
            if ($model->is_default) {
                static::where('id', '!=', $model->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }
        });
    }
}
