<?php

namespace App\Support\Booking;

use App\Models\Destination;
use App\Support\Tours\TourFilterOptionPresenter;
use App\Support\Translatable;

class CustomBookingCatalog
{
    /**
     * @return list<string>
     */
    public static function destinationNames(): array
    {
        return AfghanistanProvinces::names();
    }

    /**
     * @return list<string>
     */
    public static function allowedDestinationNames(): array
    {
        return self::destinationNames();
    }

    /**
     * @return list<string>
     */
    public static function allowedSeasonValues(): array
    {
        $seasons = collect(TourFilterOptionPresenter::forPublicHomeFinder()['seasons'])
            ->flatMap(fn (array $choice): array => [
                trim((string) ($choice['value'] ?? '')),
                trim((string) ($choice['label'] ?? '')),
            ])
            ->filter()
            ->values();

        $seasons->push(CustomBookingOptions::RECOMMEND_SEASON);

        return $seasons->unique()->values()->all();
    }

    public static function destinationIdForName(string $name): ?int
    {
        $needle = mb_strtolower(trim($name));

        if ($needle === '') {
            return null;
        }

        foreach (Destination::query()->published()->get(['id', 'name']) as $destination) {
            if (self::storedNameMatches($destination->name, $needle)) {
                return $destination->id;
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $names
     * @return array<string, int>
     */
    public static function publishedDestinationIdsByName(array $names): array
    {
        if ($names === []) {
            return [];
        }

        $destinations = Destination::query()->published()->get(['id', 'name']);
        $map = [];

        foreach ($names as $name) {
            $key = mb_strtolower(trim($name));

            if ($key === '') {
                continue;
            }

            foreach ($destinations as $destination) {
                if (self::storedNameMatches($destination->name, $key)) {
                    $map[$key] = $destination->id;
                    break;
                }
            }
        }

        return $map;
    }

    /**
     * @param  array<string, string>|string|null  $storedName
     */
    private static function storedNameMatches(array|string|null $storedName, string $needle): bool
    {
        foreach (Translatable::normalize($storedName) as $candidate) {
            if (mb_strtolower(trim($candidate)) === $needle) {
                return true;
            }
        }

        return false;
    }
}
