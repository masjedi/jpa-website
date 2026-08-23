<?php

namespace App\Enums;

enum TourListingType: string
{
    case Tour = 'tour';
    case Package = 'package';

    public static function fromFrontend(string $value): self
    {
        return match ($value) {
            'tour' => self::Tour,
            'package' => self::Package,
            default => throw new \InvalidArgumentException("Invalid tour listing type [{$value}]."),
        };
    }

    public function frontendValue(): string
    {
        return $this->value;
    }
}
