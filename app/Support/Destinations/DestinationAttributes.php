<?php

namespace App\Support\Destinations;

use App\Enums\DestinationStatus;

final class DestinationAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        $name = (string) $validated['name'];
        $region = (string) $validated['region'];
        $keywords = DestinationText::lines((string) ($validated['tour_match_keywords_text'] ?? ''));

        if ($keywords === []) {
            $keywords = array_values(array_unique(array_filter([$name, $region])));
        }

        return [
            'status' => DestinationStatus::fromFrontend((string) $validated['status']),
            'name' => $name,
            'tagline' => (string) $validated['tagline'],
            'region' => $region,
            'badge' => filled($validated['badge'] ?? null) ? (string) $validated['badge'] : null,
            'description' => (string) $validated['description'],
            'highlights' => DestinationText::lines((string) ($validated['highlights_text'] ?? '')),
            'best_season' => filled($validated['best_season'] ?? null)
                ? (string) $validated['best_season']
                : null,
            'travel_style' => filled($validated['travel_style'] ?? null)
                ? (string) $validated['travel_style']
                : null,
            'practical_notes' => DestinationText::lines((string) ($validated['practical_notes_text'] ?? '')),
            'tour_match_keywords' => $keywords,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
        ];
    }
}
