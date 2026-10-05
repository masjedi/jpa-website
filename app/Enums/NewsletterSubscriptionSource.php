<?php

namespace App\Enums;

enum NewsletterSubscriptionSource: string
{
    case Footer = 'footer';
    case Articles = 'articles';

    public static function fromFrontend(string $value): self
    {
        return match ($value) {
            'Footer' => self::Footer,
            'Articles page' => self::Articles,
            default => throw new \InvalidArgumentException("Invalid newsletter source [{$value}]."),
        };
    }

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Footer => 'Footer',
            self::Articles => 'Articles page',
        };
    }
}
