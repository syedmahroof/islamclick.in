<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\NewsLetterCampaign;

class NewsLetter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'is_subscribed',
        'unsubscribe_token',
        'unsubscribed_at',
        'last_sent_at',
        'source',
        'user_id'
    ];

    protected $casts = [
        'is_subscribed' => 'boolean',
        'last_sent_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user associated with the newsletter subscription.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the newsletter campaigns sent to this subscriber.
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(NewsLetterCampaign::class, 'subscriber_id');
    }

    /**
     * Scope a query to only include active subscribers.
     */
    public function scopeSubscribed($query)
    {
        return $query->where('is_subscribed', true);
    }

    /**
     * Unsubscribe the user from the newsletter.
     */
    public function unsubscribe(): bool
    {
        return $this->update([
            'is_subscribed' => false,
            'unsubscribed_at' => now(),
        ]);
    }

    /**
     * Resubscribe the user to the newsletter.
     */
    public function resubscribe(): bool
    {
        return $this->update([
            'is_subscribed' => true,
            'unsubscribed_at' => null,
        ]);
    }
}
