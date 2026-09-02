<?php

namespace App\Support\Tours;

use App\Models\Tour;
use Illuminate\Support\Collection;

class TourPresenter
{
    /**
     * @return array{
     *     offers: list<array<string, mixed>>,
     *     filterOptions: array{regions: list<string>, travelStyles: list<string>, difficulties: list<string>}
     * }
     */
    public static function forAdminIndex(): array
    {
        return [
            'offers' => Tour::query()
                ->latestFirst()
                ->get()
                ->map(fn (Tour $tour): array => self::adminOfferPayload($tour))
                ->values()
                ->all(),
            'filterOptions' => TourFilterOptionPresenter::forTourForm(),
        ];
    }

    /**
     * @return array{
     *     tours: list<array<string, mixed>>,
     *     packages: list<array<string, mixed>>,
     *     filterOptions: array{regions: list<string>, travelStyles: list<string>, difficulties: list<string>}
     * }
     */
    public static function forPublicIndex(): array
    {
        return [
            'tours' => Tour::query()
                ->published()
                ->tours()
                ->latestFirst()
                ->get()
                ->map(fn (Tour $tour): array => self::publicTourPayload($tour))
                ->values()
                ->all(),
            'packages' => Tour::query()
                ->published()
                ->packages()
                ->latestFirst()
                ->get()
                ->map(fn (Tour $tour): array => self::publicPackagePayload($tour))
                ->values()
                ->all(),
            'filterOptions' => TourFilterOptionPresenter::forPublicFilters(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(int $limit = 3): array
    {
        return Tour::query()
            ->published()
            ->tours()
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->map(fn (Tour $tour): array => self::publicTourPayload($tour))
            ->values()
            ->all();
    }

    /**
     * @return list<Tour>
     */
    public static function relatedTours(Tour $current, int $limit = 2): array
    {
        $candidates = Tour::query()
            ->published()
            ->tours()
            ->where('slug', '!=', $current->slug)
            ->latestFirst()
            ->get();

        return self::prioritizeSameRegion($candidates, (string) $current->region, $limit);
    }

    /**
     * @return list<Tour>
     */
    public static function relatedPackages(Tour $current, int $limit = 2): array
    {
        return Tour::query()
            ->published()
            ->packages()
            ->where('slug', '!=', $current->slug)
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->all();
    }

    /**
     * @param  list<Tour>  $related
     * @return array<string, mixed>
     */
    public static function travelOfferFromTour(Tour $tour, array $related): array
    {
        return [
            'kind' => 'tour',
            'slug' => $tour->slug,
            'title' => $tour->title,
            'tagline' => trim((string) $tour->travel_style).' · '.trim((string) $tour->destination),
            'image' => self::coverDetailUrl($tour),
            'durationDays' => $tour->duration_days,
            'durationLabel' => $tour->duration_label,
            'badge' => $tour->badge,
            'description' => $tour->summary,
            'content' => $tour->content,
            'highlights' => $tour->highlights,
            'journeyOutline' => collect($tour->itinerary_overview ?? [])
                ->map(fn (array $day): array => [
                    'phase' => (string) ($day['day'] ?? ''),
                    'title' => (string) ($day['title'] ?? ''),
                    'summary' => (string) ($day['summary'] ?? ''),
                ])
                ->values()
                ->all(),
            'destinations' => array_values(array_filter([(string) $tour->destination])),
            'sidebarIdealFor' => sprintf(
                '%s · %s · Best %s',
                (string) ($tour->group_size ?? 'Max 8 travelers / Private'),
                (string) $tour->difficulty,
                (string) ($tour->best_months ?? 'Year-round'),
            ),
            'inclusions' => $tour->inclusions ?? [],
            'breadcrumbs' => [
                'listLabel' => 'Tours',
                'listHref' => '/tours#tour-catalog',
            ],
            'labels' => [
                'request' => 'Request this tour',
                'back' => 'All tours',
                'about' => 'About this tour',
                'highlights' => 'Route highlights',
                'relatedEyebrow' => 'More tours',
                'relatedTitle' => 'You may also like',
                'relatedViewAll' => 'View all tours',
            ],
            'relatedItems' => collect($related)
                ->map(fn (Tour $relatedTour): array => self::relatedTourItem($relatedTour))
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  list<Tour>  $related
     * @return array<string, mixed>
     */
    public static function travelOfferFromPackage(Tour $package, array $related): array
    {
        return [
            'kind' => 'package',
            'slug' => $package->slug,
            'title' => $package->title,
            'tagline' => (string) $package->tagline,
            'image' => self::coverDetailUrl($package),
            'durationDays' => $package->duration_days,
            'durationLabel' => $package->duration_label,
            'badge' => $package->badge,
            'priceLabel' => (string) ($package->price_estimate ?? 'Custom quotation'),
            'description' => $package->summary,
            'highlights' => $package->highlights,
            'journeyOutline' => $package->journey_outline,
            'destinations' => $package->key_destinations ?? [],
            'sidebarIdealFor' => (string) $package->ideal_for,
            'inclusions' => $package->included_services ?? [],
            'breadcrumbs' => [
                'listLabel' => 'Packages',
                'listHref' => '/tours#packages',
            ],
            'labels' => [
                'request' => 'Request this package',
                'back' => 'All packages',
                'about' => 'About this package',
                'highlights' => 'Package highlights',
                'relatedEyebrow' => 'More packages',
                'relatedTitle' => 'You may also like',
                'relatedViewAll' => 'View all packages',
            ],
            'relatedItems' => collect($related)
                ->map(fn (Tour $relatedPackage): array => self::relatedPackageItem($relatedPackage))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminOfferPayload(Tour $tour): array
    {
        $base = [
            'id' => $tour->id,
            'slug' => $tour->slug,
            'listingType' => $tour->listing_type->frontendValue(),
            'status' => $tour->status->frontendLabel(),
            'title' => (string) $tour->title,
            'durationDays' => $tour->duration_days,
            'duration' => (string) $tour->duration_label,
            'badge' => (string) ($tour->badge ?? ''),
            'image' => self::coverCardUrl($tour),
            'description' => (string) $tour->summary,
            'highlights' => $tour->highlights ?? [],
            'inclusions' => $tour->inclusions ?? [],
        ];

        if ($tour->isPackage()) {
            return array_merge($base, [
                'destination' => (string) ($tour->destination ?? ''),
                'region' => (string) ($tour->region ?? 'Multiple Regions'),
                'tagline' => (string) ($tour->tagline ?? ''),
                'featuredPerks' => $tour->highlights ?? [],
                'keyDestinations' => $tour->key_destinations ?? [],
                'priceEstimate' => (string) ($tour->price_estimate ?? ''),
                'idealFor' => (string) ($tour->ideal_for ?? ''),
                'includedServices' => $tour->included_services ?? [],
                'journeyOutline' => $tour->journey_outline ?? [],
                'isPopular' => (bool) $tour->is_popular,
            ]);
        }

        return array_merge($base, [
            'destination' => (string) ($tour->destination ?? ''),
            'region' => (string) ($tour->region ?? ''),
            'difficulty' => (string) ($tour->difficulty ?? 'Moderate'),
            'travelStyle' => (string) ($tour->travel_style ?? 'Cultural & Heritage'),
            'season' => (string) ($tour->season ?? 'Year-round'),
            'bestMonths' => (string) ($tour->best_months ?? 'Year-round'),
            'groupSize' => (string) ($tour->group_size ?? 'Max 8 travelers / Private'),
            'content' => (string) ($tour->content ?? ''),
            'itineraryOverview' => $tour->itinerary_overview ?? [],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicTourPayload(Tour $tour): array
    {
        return [
            'id' => $tour->slug,
            'slug' => $tour->slug,
            'title' => $tour->title,
            'destination' => (string) $tour->destination,
            'region' => (string) $tour->region,
            'durationDays' => $tour->duration_days,
            'duration' => $tour->duration_label,
            'difficulty' => (string) $tour->difficulty,
            'travelStyle' => (string) $tour->travel_style,
            'season' => (string) ($tour->season ?? 'Year-round'),
            'bestMonths' => (string) ($tour->best_months ?? 'Year-round'),
            'groupSize' => (string) ($tour->group_size ?? 'Max 8 travelers / Private'),
            'image' => self::coverCardUrl($tour),
            'badge' => $tour->badge,
            'description' => $tour->summary,
            'content' => $tour->content,
            'highlights' => $tour->highlights,
            'itineraryOverview' => $tour->itinerary_overview ?? [],
            'inclusions' => $tour->inclusions ?? [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPackagePayload(Tour $package): array
    {
        return [
            'id' => $package->slug,
            'slug' => $package->slug,
            'title' => $package->title,
            'tagline' => (string) $package->tagline,
            'duration' => $package->duration_label,
            'durationDays' => $package->duration_days,
            'badge' => (string) ($package->badge ?: 'Package'),
            'image' => self::coverCardUrl($package),
            'description' => $package->summary,
            'featuredPerks' => $package->highlights,
            'keyDestinations' => $package->key_destinations ?? [],
            'priceEstimate' => (string) ($package->price_estimate ?? 'Custom quotation'),
            'idealFor' => (string) $package->ideal_for,
            'includedServices' => $package->included_services ?? [],
            'journeyOutline' => $package->journey_outline,
            'isPopular' => $package->is_popular,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function relatedTourItem(Tour $tour): array
    {
        return [
            'slug' => $tour->slug,
            'title' => $tour->title,
            'tagline' => $tour->summary,
            'image' => self::coverCardUrl($tour),
            'durationDays' => $tour->duration_days,
            'durationLabel' => $tour->duration_label,
            'badge' => $tour->badge,
            'href' => '/tours/'.$tour->slug,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function relatedPackageItem(Tour $package): array
    {
        return [
            'slug' => $package->slug,
            'title' => $package->title,
            'tagline' => (string) $package->tagline,
            'image' => self::coverCardUrl($package),
            'durationDays' => $package->duration_days,
            'durationLabel' => $package->duration_label,
            'badge' => $package->badge,
            'priceLabel' => (string) ($package->price_estimate ?? 'Custom quotation'),
            'href' => '/packages/'.$package->slug,
        ];
    }

    /**
     * @param  Collection<int, Tour>  $candidates
     * @return list<Tour>
     */
    private static function prioritizeSameRegion(Collection $candidates, string $region, int $limit): array
    {
        $sameRegion = $candidates->filter(fn (Tour $tour): bool => (string) $tour->region === $region);
        $others = $candidates->reject(fn (Tour $tour): bool => (string) $tour->region === $region);

        return $sameRegion->concat($others)->take($limit)->values()->all();
    }

    private static function coverCardUrl(Tour $tour): string
    {
        return $tour->coverAsset()?->cardUrl() ?? $tour->coverImageUrl() ?? '';
    }

    private static function coverDetailUrl(Tour $tour): string
    {
        return $tour->coverAsset()?->detailUrl() ?? $tour->coverImageUrl() ?? '';
    }
}
