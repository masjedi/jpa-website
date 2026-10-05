<?php

namespace App\Enums;

enum InquirySource: string
{
    case Contact = 'contact';
    case TourInquiry = 'tour_inquiry';
    case SeasonalPackage = 'seasonal_package';
    case CustomBooking = 'custom_booking';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Contact => 'Contact form',
            self::TourInquiry => 'Tour inquiry',
            self::SeasonalPackage => 'Seasonal package request',
            self::CustomBooking => 'Custom tour request',
        };
    }

    public function isSeasonalPackage(): bool
    {
        return $this === self::SeasonalPackage;
    }
}
