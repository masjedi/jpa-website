<?php

namespace App\Support\Booking;

use App\Models\Destination;
use App\Support\Tours\TourFilterOptionPresenter;

class CustomBookingCatalog
{
    /**
     * @return list<string>
     */
    public static function destinationNames(): array
    {
        return BookingPagePresenter::forPublicForm()['destinations'];
    }

    /**
     * @return list<string>
     */
    public static function allowedDestinationNames(): array
    {
        $names = collect(self::destinationNames())
            ->map(fn (string $name): string => trim($name))
            ->filter()
            ->values();

        if (! $names->contains(fn (string $name): bool => strcasecmp($name, CustomBookingOptions::OTHER_DESTINATION) === 0)) {
            $names->push(CustomBookingOptions::OTHER_DESTINATION);
        }

        return $names->all();
    }

    /**
     * @return list<string>
     */
    public static function allowedSeasonValues(): array
    {
        $seasons = collect(TourFilterOptionPresenter::forPublicHomeFinder()['seasons'])
            ->map(fn (mixed $name): string => trim((string) $name))
            ->filter()
            ->values();

        $seasons->push(CustomBookingOptions::RECOMMEND_SEASON);

        return $seasons->unique()->values()->all();
    }

    public static function destinationIdForName(string $name): ?int
    {
        $id = Destination::query()
            ->published()
            ->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])
            ->value('id');

        return $id !== null ? (int) $id : null;
    }
}
