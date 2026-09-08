<?php

namespace App\Support\Tours;

use App\Enums\TourFilterOptionType;
use App\Models\TourFilterOption;
use App\Support\Translatable;

class TourFilterOptionPresenter
{
    /** @var array<string, array<string, string>> */
    private static array $labelMaps = [];

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
     *     destinations: list<array{value: string, label: string}>,
     *     travelStyles: list<array{value: string, label: string}>,
     *     seasons: list<array{value: string, label: string}>,
     *     groupTypes: list<array{value: string, label: string}>
     * }
     */
    public static function forPublicHomeFinder(): array
    {
        return [
            'destinations' => self::resolvedChoicesFor(TourFilterOptionType::Destination, true),
            'travelStyles' => self::resolvedChoicesFor(TourFilterOptionType::TravelStyle, true),
            'seasons' => self::resolvedChoicesFor(TourFilterOptionType::Season, true),
            'groupTypes' => self::resolvedChoicesFor(TourFilterOptionType::GroupType, true),
        ];
    }

    /**
     * @return array{
     *     regions: list<array{value: string, label: string}>,
     *     travelStyles: list<array{value: string, label: string}>,
     *     difficulties: list<array{value: string, label: string}>
     * }
     */
    public static function forPublicFilters(): array
    {
        return [
            'regions' => self::resolvedChoicesFor(TourFilterOptionType::Region, true),
            'travelStyles' => self::resolvedChoicesFor(TourFilterOptionType::TravelStyle, true),
            'difficulties' => self::resolvedChoicesFor(TourFilterOptionType::Difficulty, true),
        ];
    }

    public static function labelFor(TourFilterOptionType $type, ?string $value): string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return '';
        }

        $map = self::labelMapFor($type);

        return $map[$value] ?? $value;
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(TourFilterOption $option): array
    {
        return [
            'id' => $option->id,
            'type' => $option->type->frontendValue(),
            'value' => (string) $option->value,
            'name' => Translatable::normalize($option->name),
            'order' => (int) $option->sort_order,
            'status' => $option->status->frontendLabel(),
            'updated' => $option->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private static function resolvedChoicesFor(TourFilterOptionType $type, bool $publishedOnly = false): array
    {
        $query = TourFilterOption::query()->ofType($type)->ordered();

        if ($publishedOnly) {
            $query->published();
        }

        return $query
            ->get()
            ->map(function (TourFilterOption $option): array {
                $value = (string) $option->value;
                $label = Translatable::resolve($option->name);

                return [
                    'value' => $value,
                    'label' => $label !== '' ? $label : $value,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<string, string>
     */
    private static function labelMapFor(TourFilterOptionType $type): array
    {
        $cacheKey = $type->value.'|'.app()->getLocale();

        if (isset(self::$labelMaps[$cacheKey])) {
            return self::$labelMaps[$cacheKey];
        }

        self::$labelMaps[$cacheKey] = TourFilterOption::query()
            ->ofType($type)
            ->get()
            ->mapWithKeys(function (TourFilterOption $option): array {
                $value = (string) $option->value;
                $label = Translatable::resolve($option->name);

                return [$value => $label !== '' ? $label : $value];
            })
            ->all();

        return self::$labelMaps[$cacheKey];
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
