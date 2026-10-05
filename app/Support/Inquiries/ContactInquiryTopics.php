<?php

namespace App\Support\Inquiries;

final class ContactInquiryTopics
{
    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return [
            'General question',
            'Plan a custom trip',
            'Join a group tour',
            'Press & partnerships',
        ];
    }

    public static function isValid(string $topic): bool
    {
        return in_array($topic, self::values(), true);
    }
}
