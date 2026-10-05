<?php

namespace App\Support\Tours;

use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;
use App\Support\Translatable;

final class TourAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated, TourListingType $listingType): array
    {
        $durationDays = (int) $validated['duration_days'];
        $highlights = Translatable::sanitizeStringListFromText($validated['highlights_text']);

        $attributes = [
            'listing_type' => $listingType,
            'status' => TourListingStatus::fromFrontend((string) $validated['status']),
            'title' => Translatable::sanitize($validated['title']),
            'summary' => Translatable::sanitize($validated['summary']),
            'destination' => Translatable::sanitize($validated['destination']),
            'region' => (string) $validated['region'],
            'duration_days' => $durationDays,
            'duration_label' => Translatable::sanitize([
                'en' => TourDuration::label($durationDays),
            ]),
            'badge' => filled($validated['badge'] ?? null)
                ? Translatable::sanitize($validated['badge'])
                : null,
            'highlights' => $highlights,
        ];

        if ($listingType === TourListingType::Package) {
            return array_merge($attributes, [
                'tagline' => Translatable::sanitize($validated['tagline']),
                'content' => null,
                'travel_style' => null,
                'difficulty' => null,
                'season' => null,
                'best_months' => null,
                'group_size' => null,
                'itinerary_overview' => null,
                'inclusions' => null,
                'key_destinations' => Translatable::sanitizeStringListFromText($validated['key_destinations_text']),
                'included_services' => Translatable::sanitizeStringListFromText($validated['included_services_text']),
                'journey_outline' => null,
                'estimated_starting_price' => null,
                'price_estimate' => Translatable::sanitize($validated['price_estimate']),
                'ideal_for' => Translatable::sanitize($validated['ideal_for']),
                'next_departure_date' => null,
                'next_departure_status' => null,
                'is_popular' => (bool) ($validated['is_popular'] ?? false),
            ]);
        }

        return array_merge($attributes, [
            'tagline' => null,
            'content' => Translatable::sanitize($validated['content']),
            'travel_style' => (string) $validated['travel_style'],
            'difficulty' => (string) $validated['difficulty'],
            'season' => Translatable::sanitize([
                'en' => 'Year-round',
            ]),
            'best_months' => Translatable::sanitize([
                'en' => 'Year-round',
            ]),
            'group_size' => Translatable::sanitize([
                'en' => 'Max 8 travelers / Private',
            ]),
            'itinerary_overview' => Translatable::normalizeStringListStorage([]),
            'inclusions' => Translatable::sanitizeStringListFromText($validated['included_services_text'] ?? []),
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
