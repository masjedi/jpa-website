<?php

namespace App\Support\Tours;

use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;

final class TourAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated, TourListingType $listingType): array
    {
        $durationDays = (int) $validated['duration_days'];
        $highlights = TourText::lines((string) $validated['highlights_text']);

        $attributes = [
            'listing_type' => $listingType,
            'status' => TourListingStatus::fromFrontend((string) $validated['status']),
            'title' => (string) $validated['title'],
            'summary' => (string) $validated['summary'],
            'destination' => (string) $validated['destination'],
            'region' => (string) $validated['region'],
            'duration_days' => $durationDays,
            'duration_label' => TourDuration::label($durationDays),
            'badge' => filled($validated['badge'] ?? null) ? (string) $validated['badge'] : null,
            'highlights' => $highlights,
        ];

        if ($listingType === TourListingType::Package) {
            return array_merge($attributes, [
                'tagline' => (string) $validated['tagline'],
                'content' => null,
                'travel_style' => null,
                'difficulty' => null,
                'season' => null,
                'best_months' => null,
                'group_size' => null,
                'itinerary_overview' => null,
                'inclusions' => null,
                'key_destinations' => TourText::lines((string) $validated['key_destinations_text']),
                'included_services' => TourText::lines((string) $validated['included_services_text']),
                'journey_outline' => null,
                'estimated_starting_price' => null,
                'price_estimate' => (string) $validated['price_estimate'],
                'ideal_for' => (string) $validated['ideal_for'],
                'next_departure_date' => null,
                'next_departure_status' => null,
                'is_popular' => (bool) ($validated['is_popular'] ?? false),
            ]);
        }

        return array_merge($attributes, [
            'tagline' => null,
            'content' => (string) $validated['content'],
            'travel_style' => (string) $validated['travel_style'],
            'difficulty' => (string) $validated['difficulty'],
            'season' => 'Year-round',
            'best_months' => 'Year-round',
            'group_size' => 'Max 8 travelers / Private',
            'itinerary_overview' => [],
            'inclusions' => TourText::lines((string) ($validated['included_services_text'] ?? '')),
            'key_destinations' => null,
            'included_services' => null,
            'journey_outline' => null,
            'estimated_starting_price' => null,
            'price_estimate' => null,
            'ideal_for' => null,
            'next_departure_date' => null,
            'next_departure_status' => null,
            'is_popular' => false,
        ]);
    }

    public static function assertListingTypeUnchanged(Tour $tour, TourListingType $requestedType): void
    {
        if ($tour->listing_type !== $requestedType) {
            abort(422, 'Listing type cannot be changed after creation.');
        }
    }
}
