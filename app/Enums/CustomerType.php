<?php

namespace App\Enums;

enum CustomerType: string
{
    // Category 1
    case B2C        = 'B2C';
    case B2B       = 'B2B';
    case OTHER    = 'Other';

    /**
     * Return all enum values as array (for dropdowns etc.)
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Return all enum names as array
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }
}
