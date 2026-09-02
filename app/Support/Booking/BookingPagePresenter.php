<?php

namespace App\Support\Booking;

use App\Models\Destination;
use App\Support\Tours\TourFilterOptionPresenter;

class BookingPagePresenter
{
    /**
     * Lookup lists for the public custom-booking form.
     *
     * @return array{destinations: list<string>, seasons: list<string>}
     */
    public static function forPublicForm(): array
    {
        $finder = TourFilterOptionPresenter::forPublicHomeFinder();

        $publishedDestinations = Destination::query()
            ->published()
            ->orderBy('name')
            ->pluck('name')
            ->map(fn (mixed $name): string => trim((string) $name))
            ->filter()
            ->all();

        $destinations = collect([...$publishedDestinations, ...$finder['destinations']])
            ->map(fn (mixed $name): string => trim((string) $name))
            ->filter()
            ->unique(fn (string $name): string => mb_strtolower($name))
            ->values()
            ->all();

        return [
            'destinations' => $destinations,
            'seasons' => $finder['seasons'],
        ];
    }
}
