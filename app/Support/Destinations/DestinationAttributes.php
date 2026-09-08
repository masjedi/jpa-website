<?php

namespace App\Support\Destinations;

use App\Enums\DestinationStatus;
use App\Support\Translatable;

final class DestinationAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        $name = Translatable::sanitize($validated['name']);
        $region = (string) $validated['region'];
        $keywords = DestinationText::lines((string) ($validated['tour_match_keywords_text'] ?? ''));

        if ($keywords === []) {
            $keywords = array_values(array_unique(array_filter([
                Translatable::resolve($name),
                $region,
            ])));
        }

        return [
            'status' => DestinationStatus::fromFrontend((string) $validated['status']),
            'name' => $name,
            'tagline' => Translatable::sanitize($validated['tagline']),
            'region' => $region,
            'badge' => filled($validated['badge'] ?? null)
                ? Translatable::sanitize($validated['badge'])
                : null,
            'description' => Translatable::sanitize($validated['description']),
            'highlights' => Translatable::sanitizeStringListFromText($validated['highlights_text'] ?? []),
            'best_season' => filled($validated['best_season'] ?? null)
                ? Translatable::sanitize($validated['best_season'])
                : null,
            'travel_style' => filled($validated['travel_style'] ?? null)
                ? Translatable::sanitize($validated['travel_style'])
                : null,
            'practical_notes' => Translatable::sanitizeStringListFromText($validated['practical_notes_text'] ?? []),
            'tour_match_keywords' => $keywords,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
        ];
    }
}
