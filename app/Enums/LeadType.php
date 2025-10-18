<?php

namespace App\Enums;

enum LeadType: string
{
    // Category 1
    case VISA_ASSISTANCE        = 'Visa Assistance';
    case DESTINATION_INFO       = 'Destination Information';
    case TOUR_GUIDE_INQUIRY     = 'Tour Guide Inquiry';
    case FLIGHT_BOOKING         = 'Flight Booking';
    case HOTEL_BOOKING          = 'Hotel Booking';
    case TRANSPORT_INQUIRY      = 'Transport Inquiry';
    case DISCOUNT_OFFER_INQUIRY = 'Discount/Offer Inquiry';
    case GROUP_BOOKING          = 'Group Booking';
    case CORPORATE_INQUIRY      = 'Corporate Inquiry';
    case HOLIDAY_PACKAGE        = 'Holiday Package';

    // Category 2
    case GENERAL_INQUIRY     = 'General Inquiry';
    case BOOKING_INQUIRY     = 'Booking Inquiry';
    case PACKAGE_INQUIRY     = 'Package Inquiry';
    case COMPLAINT           = 'Complaint';
    case FEEDBACK            = 'Feedback';
    case CANCELLATION        = 'Cancellation';
    case RESCHEDULING        = 'Rescheduling';
    case PAYMENT_ISSUE       = 'Payment Issue';
    case ITINERARY_DETAILS   = 'Itinerary Details';
    case SPECIAL_REQUESTS    = 'Special Requests';

    // Category 3
    case CUSTOM_PACKAGE        = 'Custom Package';
    case EMERGENCY_ASSISTANCE  = 'Emergency Assistance';
    case POST_TRAVEL_FEEDBACK  = 'Post-Travel Feedback';
    case OTHER                 = 'Other';

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
