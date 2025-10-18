<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Payment extends Model
{
    use SoftDeletes;

    // Payment statuses
    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_REFUNDED = 'refunded';
    public const STATUS_PARTIALLY_REFUNDED = 'partially_refunded';
    public const STATUS_CANCELLED = 'cancelled';

    // Payment methods
    public const METHOD_CREDIT_CARD = 'credit_card';
    public const METHOD_DEBIT_CARD = 'debit_card';
    public const METHOD_NET_BANKING = 'net_banking';
    public const METHOD_UPI = 'upi';
    public const METHOD_WALLET = 'wallet';
    public const METHOD_CASH = 'cash';
    public const METHOD_BANK_TRANSFER = 'bank_transfer';
    public const METHOD_CHEQUE = 'cheque';
    public const METHOD_OTHER = 'other';

    protected $fillable = [
        'payment_reference',
        'booking_id',
        'amount',
        'tax_amount',
        'fee_amount',
        'net_amount',
        'currency',
        'payment_method',
        'transaction_id',
        'status',
        'payment_gateway',
        'payment_details',
        'card_last_four',
        'card_brand',
        'billing_name',
        'billing_email',
        'billing_phone',
        'billing_address',
        'billing_city',
        'billing_state',
        'billing_country',
        'billing_postal_code',
        'failure_reason',
        'paid_at',
        'refunded_at',
        'refunded_amount',
        'refund_reason',
        'refunded_by',
        'created_by'
    ];

    protected $casts = [
        'amount' => 'float',
        'tax_amount' => 'float',
        'fee_amount' => 'float',
        'net_amount' => 'float',
        'refunded_amount' => 'float',
        'payment_details' => 'array',
        'paid_at' => 'datetime',
        'refunded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->payment_reference)) {
                $payment->payment_reference = static::generatePaymentReference();
            }
            
            if (empty($payment->status)) {
                $payment->status = self::STATUS_PENDING;
            }
        });
    }

    /**
     * Generate a unique payment reference.
     */
    public static function generatePaymentReference(): string
    {
        $prefix = 'PAY-' . date('Ymd') . '-';
        $lastPayment = static::where('payment_reference', 'like', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        $number = 1;
        if ($lastPayment) {
            $lastNumber = (int) substr($lastPayment->payment_reference, strlen($prefix));
            $number = $lastNumber + 1;
        }

        return $prefix . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Get the booking that owns the payment.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who created the payment.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who processed the refund.
     */
    public function refundedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'refunded_by');
    }

    /**
     * Get the payment details as an array.
     */
    public function getPaymentDetailsArrayAttribute(): array
    {
        return $this->payment_details ?? [];
    }

    /**
     * Check if the payment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if the payment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if the payment is failed.
     */
    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Check if the payment is refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === self::STATUS_REFUNDED;
    }

    /**
     * Check if the payment is partially refunded.
     */
    public function isPartiallyRefunded(): bool
    {
        return $this->status === self::STATUS_PARTIALLY_REFUNDED;
    }

    /**
     * Check if the payment can be refunded.
     */
    public function canBeRefunded(): bool
    {
        return $this->isCompleted() && 
               !$this->isRefunded() && 
               $this->amount > $this->refunded_amount;
    }

    /**
     * Get the remaining amount that can be refunded.
     */
    public function getRefundableAmount(): float
    {
        return $this->amount - $this->refunded_amount;
    }

    /**
     * Mark the payment as completed.
     */
    public function markAsCompleted(string $transactionId = null, array $details = []): bool
    {
        return $this->update([
            'status' => self::STATUS_COMPLETED,
            'transaction_id' => $transactionId ?? $this->transaction_id,
            'payment_details' => array_merge($this->payment_details ?? [], $details),
            'paid_at' => $this->paid_at ?? now(),
        ]);
    }

    /**
     * Mark the payment as failed.
     */
    public function markAsFailed(string $reason = null): bool
    {
        return $this->update([
            'status' => self::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);
    }

    /**
     * Process a refund for this payment.
     */
    public function processRefund(float $amount = null, string $reason = null, int $refundedById = null): bool
    {
        if (!$this->canBeRefunded()) {
            return false;
        }

        $refundAmount = $amount ?? $this->getRefundableAmount();
        
        if ($refundAmount <= 0 || $refundAmount > $this->getRefundableAmount()) {
            return false;
        }

        $isFullRefund = $refundAmount === $this->amount;
        $isPartialRefund = $refundAmount < $this->amount;

        $updates = [
            'refunded_amount' => $this->refunded_amount + $refundAmount,
            'refund_reason' => $reason,
            'refunded_by' => $refundedById,
            'refunded_at' => now(),
        ];

        if ($isFullRefund) {
            $updates['status'] = self::STATUS_REFUNDED;
        } elseif ($isPartialRefund) {
            $updates['status'] = self::STATUS_PARTIALLY_REFUNDED;
        }

        return $this->update($updates);
    }

    /**
     * Get the payment method label.
     */
    public function getPaymentMethodLabelAttribute(): string
    {
        return static::getPaymentMethodLabel($this->payment_method);
    }

    /**
     * Get all available payment methods.
     */
    public static function getPaymentMethods(): array
    {
        return [
            self::METHOD_CREDIT_CARD => 'Credit Card',
            self::METHOD_DEBIT_CARD => 'Debit Card',
            self::METHOD_NET_BANKING => 'Net Banking',
            self::METHOD_UPI => 'UPI',
            self::METHOD_WALLET => 'Wallet',
            self::METHOD_CASH => 'Cash',
            self::METHOD_BANK_TRANSFER => 'Bank Transfer',
            self::METHOD_CHEQUE => 'Cheque',
            self::METHOD_OTHER => 'Other',
        ];
    }

    /**
     * Get the label for a payment method.
     */
    public static function getPaymentMethodLabel(string $method): string
    {
        return self::getPaymentMethods()[$method] ?? ucfirst(str_replace('_', ' ', $method));
    }

    /**
     * Get all available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_FAILED => 'Failed',
            self::STATUS_REFUNDED => 'Refunded',
            self::STATUS_PARTIALLY_REFUNDED => 'Partially Refunded',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }

    /**
     * Get the label for a status.
     */
    public function getStatusLabelAttribute(): string
    {
        return self::getStatuses()[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Get the payment amount with currency symbol.
     */
    public function getFormattedAmountAttribute(): string
    {
        $symbol = $this->getCurrencySymbol();
        return $symbol . number_format($this->amount, 2);
    }

    /**
     * Get the currency symbol.
     */
    protected function getCurrencySymbol(): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'INR' => '₹',
            'AUD' => 'A$',
            'CAD' => 'C$',
            'JPY' => '¥',
        ];

        return $symbols[$this->currency] ?? $this->currency . ' ';
    }
}
