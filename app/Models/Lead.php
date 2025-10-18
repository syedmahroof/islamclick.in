<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use App\Models\LeadPerson;
use App\Models\LeadFollowUp;
use App\Models\LeadNote;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'job_title',
        'website',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'status',
        'source_id',
        'priority_id',
        'agent_id',
        'description',
        'last_contacted_at',
        'converted_at',
        'lost_reason',
        'lost_at',
        'created_by',
        'updated_by',
    ];

    protected static function booted()
    {
        static::created(function ($lead) {
            $lead->recordActivity('created');
        });

        static::updated(function ($lead) {
            $changes = $lead->getDirty();
            
            // Don't log updated_at changes
            if (count($changes) === 1 && isset($changes['updated_at'])) {
                return;
            }

            $lead->recordActivity('updated', [
                'changes' => $changes,
            ]);
        });
    }

    protected $casts = [
        'last_contacted_at' => 'datetime',
        'converted_at' => 'datetime',
        'lost_at' => 'datetime',
    ];

    // Status constants
    public const STATUS_NEW = 'new';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_QUALIFIED = 'qualified';
    public const STATUS_PROPOSAL = 'proposal';
    public const STATUS_NEGOTIATION = 'negotiation';
    public const STATUS_CONVERTED = 'converted';
    public const STATUS_LOST = 'lost';

    public static function statuses(): array
    {
        return [
            self::STATUS_NEW => 'New',
            self::STATUS_CONTACTED => 'Contacted',
            self::STATUS_QUALIFIED => 'Qualified',
            self::STATUS_PROPOSAL => 'Proposal',
            self::STATUS_NEGOTIATION => 'Negotiation',
            self::STATUS_CONVERTED => 'Converted',
            self::STATUS_LOST => 'Lost',
        ];
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(LeadSource::class, 'source_id');
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(LeadPriority::class, 'priority_id');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(LeadAgent::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class)->latest();
    }

    public function recordActivity(string $type, array $properties = []): void
    {
        $this->activities()->create([
            'user_id' => Auth::id(),
            'type' => $type,
            'properties' => $properties,
        ]);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function persons(): HasMany
    {
        return $this->hasMany(LeadPerson::class);
    }

    public function follow_ups(): HasMany
    {
        return $this->hasMany(LeadFollowUp::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LeadNote::class);
    }

    public function scopeNew($query)
    {
        return $query->where('status', self::STATUS_NEW);
    }

    public function scopeQualified($query)
    {
        return $query->where('status', self::STATUS_QUALIFIED);
    }

    public function scopeConverted($query)
    {
        return $query->where('status', self::STATUS_CONVERTED);
    }

    public function scopeLost($query)
    {
        return $query->where('status', self::STATUS_LOST);
    }

    public function scopeAssignedTo($query, $agentId)
    {
        return $query->where('agent_id', $agentId);
    }

    public function markAsConverted()
    {
        $this->update([
            'status' => self::STATUS_CONVERTED,
            'converted_at' => now(),
        ]);
    }

    public function markAsLost($reason = null)
    {
        $this->update([
            'status' => self::STATUS_LOST,
            'lost_reason' => $reason,
            'lost_at' => now(),
        ]);
    }
}
