<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class BookingParticipant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'passport_number',
        'passport_expiry_date',
        'nationality',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'country',
        'postal_code',
        'is_primary',
        'special_requirements',
        'emergency_contact',
        'dietary_restrictions',
        'medical_conditions',
        'created_by'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'passport_expiry_date' => 'date',
        'is_primary' => 'boolean',
        'emergency_contact' => 'array',
        'dietary_restrictions' => 'array',
        'medical_conditions' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Gender options
    public const GENDER_MALE = 'male';
    public const GENDER_FEMALE = 'female';
    public const GENDER_OTHER = 'other';
    public const GENDER_PREFER_NOT_TO_SAY = 'prefer_not_to_say';

    /**
     * Get the booking that owns the participant.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who created the participant record.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the participant's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get the participant's age.
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->date_of_birth) {
            return null;
        }

        return Carbon::parse($this->date_of_birth)->age;
    }

    /**
     * Check if the participant is a minor.
     */
    public function getIsMinorAttribute(): bool
    {
        return $this->age !== null && $this->age < 18;
    }

    /**
     * Check if the passport is expired.
     */
    public function getIsPassportExpiredAttribute(): bool
    {
        if (!$this->passport_expiry_date) {
            return false;
        }

        return $this->passport_expiry_date->isPast();
    }

    /**
     * Check if the passport will expire within the given number of months.
     */
    public function isPassportExpiringWithinMonths(int $months = 6): bool
    {
        if (!$this->passport_expiry_date) {
            return false;
        }

        return $this->passport_expiry_date->isBetween(
            now(),
            now()->addMonths($months)
        );
    }

    /**
     * Get the emergency contact as an array.
     */
    public function getEmergencyContactArrayAttribute(): array
    {
        return $this->emergency_contact ?? [];
    }

    /**
     * Get the dietary restrictions as an array.
     */
    public function getDietaryRestrictionsArrayAttribute(): array
    {
        return $this->dietary_restrictions ?? [];
    }

    /**
     * Get the medical conditions as an array.
     */
    public function getMedicalConditionsArrayAttribute(): array
    {
        return $this->medical_conditions ?? [];
    }

    /**
     * Get the address as a formatted string.
     */
    public function getFormattedAddressAttribute(): string
    {
        $parts = [
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ];

        return implode(', ', array_filter($parts));
    }

    /**
     * Get all available gender options.
     */
    public static function getGenderOptions(): array
    {
        return [
            self::GENDER_MALE => 'Male',
            self::GENDER_FEMALE => 'Female',
            self::GENDER_OTHER => 'Other',
            self::GENDER_PREFER_NOT_TO_SAY => 'Prefer not to say',
        ];
    }

    /**
     * Get the gender label.
     */
    public function getGenderLabelAttribute(): string
    {
        return self::getGenderOptions()[$this->gender] ?? ucfirst($this->gender);
    }

    /**
     * Scope a query to only include primary participants.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope a query to only include adult participants.
     */
    public function scopeAdults($query)
    {
        return $query->whereDate('date_of_birth', '<=', now()->subYears(18));
    }

    /**
     * Scope a query to only include minor participants.
     */
    public function scopeMinors($query)
    {
        return $query->whereDate('date_of_birth', '>', now()->subYears(18));
    }
}
