<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeadAgent extends Model
{
    protected $fillable = [
        'user_id',
        'is_active',
        'leads_count',
        'converted_leads_count',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'leads_count' => 'integer',
        'converted_leads_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'agent_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFullNameAttribute(): string
    {
        return $this->user->name;
    }

    public function getEmailAttribute(): string
    {
        return $this->user->email;
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->user->profile_photo_url ?? null;
    }
}
