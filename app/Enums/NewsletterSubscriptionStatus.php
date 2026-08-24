<?php

namespace App\Enums;

enum NewsletterSubscriptionStatus: string
{
    case Active = 'active';
    case Unsubscribed = 'unsubscribed';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Unsubscribed => 'Unsubscribed',
        };
    }
}
