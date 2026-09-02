<?php

namespace App\Enums;

enum ServiceOfferingCategory: string
{
    case Journey = 'journey';
    case OnGround = 'on_ground';
    case Logistics = 'logistics';

    public static function fromFrontend(string $value): self
    {
        return match ($value) {
            'Journey' => self::Journey,
            'On-ground' => self::OnGround,
            'Logistics' => self::Logistics,
            default => throw new \InvalidArgumentException("Invalid service offering category [{$value}]."),
        };
    }

    /**
     * @return list<string>
     */
    public static function frontendValues(): array
    {
        return array_map(
            fn (self $category): string => $category->frontendLabel(),
            self::cases(),
        );
    }

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Journey => 'Journey',
            self::OnGround => 'On-ground',
            self::Logistics => 'Logistics',
        };
    }
}
