<?php

namespace App\Enums;

enum InquirySource: string
{
    case Contact = 'contact';
    case TourInquiry = 'tour_inquiry';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Contact => 'Contact form',
            self::TourInquiry => 'Tour inquiry',
        };
    }
}
