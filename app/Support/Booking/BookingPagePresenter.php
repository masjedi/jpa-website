<?php

namespace App\Support\Booking;

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

        return [
            'destinations' => AfghanistanProvinces::names(),
            'seasons' => collect($finder['seasons'])
                ->map(fn (array $choice): string => trim((string) ($choice['label'] ?? $choice['value'] ?? '')))
                ->filter()
                ->values()
                ->all(),
        ];
    }
}
