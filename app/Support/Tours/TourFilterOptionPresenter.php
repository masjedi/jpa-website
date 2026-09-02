<?php

namespace App\Support\Tours;

use App\Enums\TourFilterOptionType;
use App\Models\TourFilterOption;

class TourFilterOptionPresenter
{
    /**
     * @return array{
     *     regions: list<array<string, mixed>>,
     *     travelStyles: list<array<string, mixed>>,
     *     difficulties: list<array<string, mixed>>
     * }
     */
    public static function forAdminIndex(): array
    {
        $grouped = TourFilterOption::query()
            ->ordered()
            ->get()
            ->groupBy(fn (TourFilterOption $option): string => $option->type->frontendValue());

        return [
            'regions' => self::adminGroup($grouped->get('region')),
            'travelStyles' => self::adminGroup($grouped->get('travelStyle')),
            'difficulties' => self::adminGroup($grouped->get('difficulty')),
        ];
    }

    /**
     * @return array{regions: list<string>, travelStyles: list<string>, difficulties: list<string>}
     */
    public static function forTourForm(): array
    {
        return [
            'regions' => TourFilterOption::namesFor(TourFilterOptionType::Region),
            'travelStyles' => TourFilterOption::namesFor(TourFilterOptionType::TravelStyle),
            'difficulties' => TourFilterOption::namesFor(TourFilterOptionType::Difficulty),
        ];
    }

    /**
     * @return array{
     *     destinations: list<array<string, mixed>>,
     *     travelStyles: list<array<string, mixed>>,
     *     seasons: list<array<string, mixed>>,
     *     groupTypes: list<array<string, mixed>>
     * }
     */
    public static function forHomeFinderIndex(): array
    {
        $grouped = TourFilterOption::query()
            ->ordered()
            ->get()
            ->groupBy(fn (TourFilterOption $option): string => $option->type->frontendValue());

        return [
            'destinations' => self::adminGroup($grouped->get('destination')),
            'travelStyles' => self::adminGroup($grouped->get('travelStyle')),
            'seasons' => self::adminGroup($grouped->get('season')),
            'groupTypes' => self::adminGroup($grouped->get('groupType')),
        ];
    }

    /**
     * @return array{
     *     destinations: list<string>,
     *     travelStyles: list<string>,
     *     seasons: list<string>,
     *     groupTypes: list<string>
     * }
     */
    public static function forPublicHomeFinder(): array
    {
        return [
            'destinations' => TourFilterOption::namesFor(TourFilterOptionType::Destination, true),
            'travelStyles' => TourFilterOption::namesFor(TourFilterOptionType::TravelStyle, true),
            'seasons' => TourFilterOption::namesFor(TourFilterOptionType::Season, true),
            'groupTypes' => TourFilterOption::namesFor(TourFilterOptionType::GroupType, true),
        ];
    }

    /**
     * @return array{regions: list<string>, travelStyles: list<string>, difficulties: list<string>}
     */
    public static function forPublicFilters(): array
    {
        return [
            'regions' => TourFilterOption::namesFor(TourFilterOptionType::Region, true),
            'travelStyles' => TourFilterOption::namesFor(TourFilterOptionType::TravelStyle, true),
            'difficulties' => TourFilterOption::namesFor(TourFilterOptionType::Difficulty, true),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(TourFilterOption $option): array
    {
        return [
            'id' => $option->id,
            'type' => $option->type->frontendValue(),
            'name' => (string) $option->name,
            'order' => (int) $option->sort_order,
            'status' => $option->status->frontendLabel(),
            'updated' => $option->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @param  iterable<int, TourFilterOption>|null  $options
     * @return list<array<string, mixed>>
     */
    private static function adminGroup(?iterable $options): array
    {
        if ($options === null) {
            return [];
        }

        return collect($options)
            ->map(fn (TourFilterOption $option): array => self::adminPayload($option))
            ->values()
            ->all();
    }
}
