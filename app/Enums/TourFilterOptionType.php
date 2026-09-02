<?php

namespace App\Enums;

enum TourFilterOptionType: string
{
    case Region = 'region';
    case TravelStyle = 'travel_style';
    case Difficulty = 'difficulty';
    case Destination = 'destination';
    case Season = 'season';
    case GroupType = 'group_type';

    public static function fromFrontend(string $value): self
    {
        return match ($value) {
            'region' => self::Region,
            'travelStyle' => self::TravelStyle,
            'difficulty' => self::Difficulty,
            'destination' => self::Destination,
            'season' => self::Season,
            'groupType' => self::GroupType,
            default => throw new \InvalidArgumentException("Invalid tour filter option type [{$value}]."),
        };
    }

    /**
     * @return list<string>
     */
    public static function frontendValues(): array
    {
        return array_map(
            fn (self $type): string => $type->frontendValue(),
            self::cases(),
        );
    }

    public function frontendValue(): string
    {
        return match ($this) {
            self::Region => 'region',
            self::TravelStyle => 'travelStyle',
            self::Difficulty => 'difficulty',
            self::Destination => 'destination',
            self::Season => 'season',
            self::GroupType => 'groupType',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Region => 'Region',
            self::TravelStyle => 'Travel style',
            self::Difficulty => 'Difficulty',
            self::Destination => 'Destination',
            self::Season => 'Season',
            self::GroupType => 'Group type',
        };
    }

    public function tourColumn(): ?string
    {
        return match ($this) {
            self::Region => 'region',
            self::TravelStyle => 'travel_style',
            self::Difficulty => 'difficulty',
            default => null,
        };
    }

    public function adminIndexRouteName(): string
    {
        return match ($this) {
            self::Destination, self::Season, self::GroupType => 'admin.home-finder.index',
            self::Region, self::Difficulty => 'admin.filter-placement.index',
            self::TravelStyle => str_contains((string) request()->headers->get('referer'), '/admin/home-finder')
                ? 'admin.home-finder.index'
                : 'admin.filter-placement.index',
        };
    }
}
