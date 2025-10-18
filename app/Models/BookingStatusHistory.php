<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BookingStatusHistory extends Model
{
    // Status change sources
    public const SOURCE_SYSTEM = 'system';
    public const SOURCE_ADMIN = 'admin';
    public const SOURCE_API = 'api';
    public const SOURCE_USER = 'user';
    public const SOURCE_CRON = 'cron';
    public const SOURCE_WEBHOOK = 'webhook';
    public const SOURCE_IMPORT = 'import';
    public const SOURCE_OTHER = 'other';

    protected $fillable = [
        'booking_id',
        'status',
        'previous_status',
        'comments',
        'metadata',
        'changed_by',
        'effective_from',
        'effective_to',
        'is_system_generated',
        'source',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array',
        'effective_from' => 'datetime',
        'effective_to' => 'datetime',
        'is_system_generated' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->source)) {
                $model->source = self::determineSource();
            }

            if (empty($model->changed_by) && Auth::check()) {
                $model->changed_by = Auth::id();
            }

            if (empty($model->ip_address)) {
                $model->ip_address = request()?->ip();
            }

            if (empty($model->user_agent)) {
                $model->user_agent = request()?->userAgent();
            }

            if (empty($model->effective_from)) {
                $model->effective_from = now();
            }
        });
    }

    /**
     * Get the booking that owns the status history.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who changed the status.
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Get all available status change sources.
     */
    public static function getSources(): array
    {
        return [
            self::SOURCE_SYSTEM => 'System',
            self::SOURCE_ADMIN => 'Admin',
            self::SOURCE_API => 'API',
            self::SOURCE_USER => 'User',
            self::SOURCE_CRON => 'Scheduled Task',
            self::SOURCE_WEBHOOK => 'Webhook',
            self::SOURCE_IMPORT => 'Import',
            self::SOURCE_OTHER => 'Other',
        ];
    }

    /**
     * Get the source label.
     */
    public function getSourceLabelAttribute(): string
    {
        return self::getSources()[$this->source] ?? Str::title(str_replace('_', ' ', $this->source));
    }

    /**
     * Scope a query to only include system-generated status changes.
     */
    public function scopeSystemGenerated($query)
    {
        return $query->where('is_system_generated', true);
    }

    /**
     * Scope a query to only include manual status changes.
     */
    public function scopeManual($query)
    {
        return $query->where('is_system_generated', false);
    }

    /**
     * Scope a query to only include status changes for a specific booking.
     */
    public function scopeForBooking($query, $bookingId)
    {
        return $query->where('booking_id', $bookingId);
    }

    /**
     * Scope a query to only include status changes for a specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include active status changes (where effective_to is null or in the future).
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('effective_to')
              ->orWhere('effective_to', '>=', now());
        });
    }

    /**
     * Get the metadata as an array.
     */
    public function getMetadataArrayAttribute(): array
    {
        return $this->metadata ?? [];
    }

    /**
     * Determine if the status change is currently active.
     */
    public function isActive(): bool
    {
        return $this->effective_to === null || $this->effective_to->isFuture();
    }

    /**
     * Determine the source of the status change.
     */
    protected static function determineSource(): string
    {
        if (app()->runningInConsole()) {
            return self::SOURCE_SYSTEM;
        }

        $route = request()?->route();
        
        if (!$route) {
            return self::SOURCE_OTHER;
        }

        $routeName = $route->getName() ?? '';
        
        if (Str::startsWith($routeName, 'admin.')) {
            return self::SOURCE_ADMIN;
        }
        
        if (Str::startsWith($routeName, 'api.')) {
            return self::SOURCE_API;
        }
        
        return self::SOURCE_USER;
    }

    /**
     * Create a new status history record.
     */
    public static function createStatusHistory(
        int $bookingId,
        string $status,
        ?string $previousStatus = null,
        ?string $comments = null,
        ?array $metadata = null,
        ?int $changedById = null,
        ?string $source = null,
        ?bool $isSystemGenerated = null
    ): self {
        return static::create([
            'booking_id' => $bookingId,
            'status' => $status,
            'previous_status' => $previousStatus,
            'comments' => $comments,
            'metadata' => $metadata,
            'changed_by' => $changedById,
            'source' => $source,
            'is_system_generated' => $isSystemGenerated ?? ($source === self::SOURCE_SYSTEM),
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
            'effective_from' => now(),
        ]);
    }

    /**
     * Get the most recent status change for a booking.
     */
    public static function getLatestForBooking(int $bookingId): ?self
    {
        return static::where('booking_id', $bookingId)
            ->latest('effective_from')
            ->first();
    }

    /**
     * Get all status changes for a booking, ordered by effective date.
     */
    public static function getHistoryForBooking(int $bookingId)
    {
        return static::where('booking_id', $bookingId)
            ->orderBy('effective_from', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
