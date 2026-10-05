<?php

namespace App\Enums;

enum AboutJourneyStepStatus: string
{
    case Published = 'published';
    case Draft = 'draft';

    public static function fromFrontend(string $value): self
    {
        return match ($value) {
            'Published' => self::Published,
            'Draft' => self::Draft,
            default => throw new \InvalidArgumentException("Invalid about journey step status [{$value}]."),
        };
    }

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Published => 'Published',
            self::Draft => 'Draft',
        };
    }
}
