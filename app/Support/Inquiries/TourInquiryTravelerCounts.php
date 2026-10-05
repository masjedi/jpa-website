<?php

namespace App\Support\Inquiries;

final class TourInquiryTravelerCounts
{
    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return [
            '1',
            '2',
            '3-4',
            '5-8',
            '9+',
        ];
    }

    public static function isValid(string $count): bool
    {
        return in_array($count, self::values(), true);
    }
}
