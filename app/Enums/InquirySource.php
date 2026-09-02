<?php

namespace App\Enums;

enum InquirySource: string
{
    case Contact = 'contact';
    case TourInquiry = 'tour_inquiry';
    case CustomBooking = 'custom_booking';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Contact => 'Contact form',
            self::TourInquiry => 'Tour inquiry',
            self::CustomBooking => 'Custom tour request',
        };
    }
}
