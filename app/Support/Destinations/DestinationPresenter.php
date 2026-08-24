<?php

namespace App\Support\Destinations;

use App\Enums\TourListingType;
use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Support\Collection;

class DestinationPresenter
{
    /**
     * @return array{destinations: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        $tours = self::tourCandidates();

        return [
            'destinations' => Destination::query()
                ->latestFirst()
                ->get()
                ->map(fn (Destination $destination): array => self::adminPayload($destination, $tours))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{destinations: list<array<string, mixed>>}
     */
    public static function forPublicIndex(): array
    {
        $tours = self::tourCandidates();

        return [
            'destinations' => Destination::query()
                ->published()
                ->featuredFirst()
                ->get()
                ->map(fn (Destination $destination): array => self::publicCardPayload($destination, $tours))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(int $limit = 4): array
    {
        $tours = self::tourCandidates();

        return Destination::query()
            ->published()
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->map(fn (Destination $destination): array => self::publicCardPayload($destination, $tours))
            ->values()
            ->all();
    }

    /**
     * @return array{
     *     destination: array<string, mixed>,
     *     relatedTours: list<array<string, mixed>>,
     *     relatedDestinations: list<array<string, mixed>>
     * }
     */
    public static function forPublicShow(Destination $destination): array
    {
        return [
            'destination' => self::publicDetailPayload($destination),
            'relatedTours' => self::relatedTourPayloads($destination),
            'relatedDestinations' => self::relatedDestinationPayloads($destination),
        ];
    }

    /**
     * @param  Collection<int, Tour>|null  $tours
     * @return array<string, mixed>
     */
    public static function adminPayload(Destination $destination, $tours = null): array
    {
        $linkedTours = self::matchingTours($destination, $tours);

        return [
            'id' => $destination->id,
            'slug' => $destination->slug,
            'status' => $destination->status->frontendLabel(),
            'name' => (string) $destination->name,
            'tagline' => (string) $destination->tagline,
            'region' => (string) $destination->region,
            'badge' => (string) ($destination->badge ?? ''),
            'image' => self::coverCardUrl($destination),
            'description' => (string) $destination->description,
            'highlights' => $destination->highlights ?? [],
            'bestSeason' => (string) ($destination->best_season ?? ''),
            'travelStyle' => (string) ($destination->travel_style ?? ''),
            'practicalNotes' => $destination->practical_notes ?? [],
            'tourMatchKeywords' => $destination->tour_match_keywords ?? [],
            'isFeatured' => (bool) $destination->is_featured,
            'linkedToursCount' => $linkedTours->count(),
            'linkedTours' => $linkedTours
                ->take(4)
                ->map(fn (Tour $tour): array => [
                    'id' => (string) $tour->id,
                    'title' => (string) $tour->title,
                    'meta' => trim(implode(' · ', array_filter([
                        (string) ($tour->duration_label ?? ''),
                        (string) ($tour->travel_style ?? ''),
                    ]))),
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  Collection<int, Tour>|null  $tours
     * @return array<string, mixed>
     */
    public static function publicCardPayload(Destination $destination, $tours = null): array
    {
        $linkedTours = self::matchingTours($destination, $tours);

        return [
            'id' => $destination->slug,
            'slug' => $destination->slug,
            'name' => (string) $destination->name,
            'tagline' => (string) $destination->tagline,
            'region' => (string) $destination->region,
            'badge' => filled($destination->badge) ? (string) $destination->badge : null,
            'image' => self::coverCardUrl($destination),
            'description' => (string) $destination->description,
            'highlights' => $destination->highlights ?? [],
            'bestSeason' => (string) ($destination->best_season ?? ''),
            'travelStyle' => (string) ($destination->travel_style ?? ''),
            'practicalNotes' => $destination->practical_notes ?? [],
            'tourMatchKeywords' => $destination->tour_match_keywords ?? [],
            'isFeatured' => (bool) $destination->is_featured,
            'linkedToursCount' => $linkedTours->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicDetailPayload(Destination $destination): array
    {
        return [
            'id' => $destination->slug,
            'slug' => $destination->slug,
            'name' => (string) $destination->name,
            'tagline' => (string) $destination->tagline,
            'region' => (string) $destination->region,
            'badge' => filled($destination->badge) ? (string) $destination->badge : null,
            'image' => self::coverDetailUrl($destination),
            'description' => (string) $destination->description,
            'highlights' => $destination->highlights ?? [],
            'bestSeason' => (string) ($destination->best_season ?? ''),
            'travelStyle' => (string) ($destination->travel_style ?? ''),
            'practicalNotes' => $destination->practical_notes ?? [],
            'tourMatchKeywords' => $destination->tour_match_keywords ?? [],
            'isFeatured' => (bool) $destination->is_featured,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function relatedTourPayloads(Destination $destination, int $limit = 4): array
    {
        return self::matchingTours($destination)
            ->take($limit)
            ->map(fn (Tour $tour): array => [
                'id' => $tour->slug,
                'slug' => $tour->slug,
                'title' => (string) $tour->title,
                'duration' => (string) $tour->duration_label,
                'travelStyle' => (string) ($tour->travel_style ?? ''),
                'href' => '/tours/'.$tour->slug,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function relatedDestinationPayloads(Destination $current, int $limit = 2): array
    {
        $candidates = Destination::query()
            ->published()
            ->where('slug', '!=', $current->slug)
            ->featuredFirst()
            ->get();

        $sameRegion = $candidates->filter(
            fn (Destination $destination): bool => (string) $destination->region === (string) $current->region,
        );
        $others = $candidates->reject(
            fn (Destination $destination): bool => (string) $destination->region === (string) $current->region,
        );

        return $sameRegion
            ->concat($others)
            ->take($limit)
            ->map(fn (Destination $destination): array => [
                'id' => $destination->slug,
                'slug' => $destination->slug,
                'name' => (string) $destination->name,
                'tagline' => (string) $destination->tagline,
                'region' => (string) $destination->region,
                'image' => self::coverCardUrl($destination),
            ])
            ->values()
            ->all();
    }

    /**
     * @return Collection<int, Tour>
     */
    private static function tourCandidates(): Collection
    {
        return Tour::query()
            ->published()
            ->where('listing_type', TourListingType::Tour)
            ->select(['id', 'slug', 'title', 'destination', 'region', 'duration_label', 'travel_style'])
            ->latestFirst()
            ->get();
    }

    /**
     * @param  Collection<int, Tour>|null  $tours
     * @return Collection<int, Tour>
     */
    private static function matchingTours(Destination $destination, $tours = null): Collection
    {
        $keywords = collect($destination->tour_match_keywords ?? [])
            ->map(fn ($keyword) => mb_strtolower(trim((string) $keyword)))
            ->filter()
            ->values();

        if ($keywords->isEmpty()) {
            return collect();
        }

        $haystack = $tours ?? self::tourCandidates();

        return $haystack->filter(function (Tour $tour) use ($keywords): bool {
            $blob = mb_strtolower(implode(' ', array_filter([
                (string) $tour->title,
                (string) ($tour->destination ?? ''),
                (string) ($tour->region ?? ''),
            ])));

            return $keywords->contains(fn (string $keyword): bool => str_contains($blob, $keyword));
        })->values();
    }

    private static function coverCardUrl(Destination $destination): string
    {
        return $destination->coverAsset()?->cardUrl()
            ?? $destination->coverImageUrl()
            ?? '';
    }

    private static function coverDetailUrl(Destination $destination): string
    {
        return $destination->coverAsset()?->detailUrl()
            ?? $destination->coverImageUrl()
            ?? '';
    }
}
