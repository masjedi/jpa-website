<?php

namespace App\Support\Tours;

use App\Enums\TourFilterOptionType;
use App\Models\Destination;
use App\Models\Tour;
use App\Support\Destinations\DestinationPresenter;
use App\Support\Translatable;
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
            ...self::forPublicDiscovery('tours'),
            'packages' => Tour::query()
                ->published()
                ->packages()
                ->latestFirst()
                ->get()
                ->map(fn (Tour $tour): array => self::publicPackagePayload($tour))
                ->values()
                ->all(),
        ];
    }

    /**
     * Unified tours discovery payload for a single catalog view.
     *
     * @return array{
     *     view: 'tours'|'packages'|'destinations',
     *     tours: list<array<string, mixed>>,
     *     packages: list<array<string, mixed>>,
     *     destinations: list<array<string, mixed>>,
     *     filterOptions: array{regions: list<string>, travelStyles: list<string>, difficulties: list<string>},
     *     destinationFilters: list<array{slug: string, name: string}>,
     *     heroImage: string|null
     * }
     */
    public static function forPublicDiscovery(string $view): array
    {
        $normalized = match ($view) {
            'packages', 'destinations' => $view,
            default => 'tours',
        };

        $emptyFilters = [
            'regions' => [],
            'travelStyles' => [],
            'difficulties' => [],
        ];

        $payload = [
            'view' => $normalized,
            'tours' => [],
            'packages' => [],
            'destinations' => [],
            'filterOptions' => $emptyFilters,
            'destinationFilters' => [],
            'heroImage' => self::discoveryHeroImage(),
        ];

        if ($normalized === 'packages') {
            $payload['packages'] = Tour::query()
                ->published()
                ->packages()
                ->latestFirst()
                ->get()
                ->map(fn (Tour $tour): array => self::publicPackagePayload($tour))
                ->values()
                ->all();

            return $payload;
        }

        if ($normalized === 'destinations') {
            $payload['destinations'] = DestinationPresenter::forPublicIndex()['destinations'];

            return $payload;
        }

        $destinationSlugMap = DestinationPresenter::tourDestinationSlugMap();

        $payload['tours'] = Tour::query()
            ->published()
            ->tours()
            ->latestFirst()
            ->get()
            ->map(fn (Tour $tour): array => self::publicTourPayload(
                $tour,
                $destinationSlugMap[$tour->slug] ?? [],
            ))
            ->values()
            ->all();
        $payload['filterOptions'] = TourFilterOptionPresenter::forPublicFilters();
        $payload['destinationFilters'] = DestinationPresenter::forTourDiscoveryFilters();

        return $payload;
    }

    private static function discoveryHeroImage(): ?string
    {
        $tour = Tour::query()
            ->published()
            ->tours()
            ->whereNotNull('cover_media')
            ->latestFirst()
            ->first();

        if ($tour !== null) {
            $url = self::coverDetailUrl($tour);

            if ($url !== '') {
                return $url;
            }
        }

        $destination = Destination::query()
            ->published()
            ->whereNotNull('cover_media')
            ->featuredFirst()
            ->first();

        if ($destination !== null) {
            $url = $destination->coverAsset()?->detailUrl()
                ?? $destination->coverImageUrl()
                ?? '';

            return $url !== '' ? $url : null;
        }

        return null;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(int $limit = 3): array
    {
        $destinationSlugMap = DestinationPresenter::tourDestinationSlugMap();

        return Tour::query()
            ->published()
            ->tours()
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->map(fn (Tour $tour): array => self::publicTourPayload(
                $tour,
                $destinationSlugMap[$tour->slug] ?? [],
            ))
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
        $itinerary = Translatable::resolveJsonList($tour->itinerary_overview);

        return [
            'kind' => 'tour',
            'slug' => $tour->slug,
            'title' => Translatable::resolve($tour->title),
            'tagline' => TourFilterOptionPresenter::labelFor(
                TourFilterOptionType::TravelStyle,
                (string) $tour->travel_style,
            ).' · '.Translatable::resolve($tour->destination),
            'image' => self::coverDetailUrl($tour),
            'durationDays' => $tour->duration_days,
            'durationLabel' => Translatable::resolve($tour->duration_label),
            'badge' => Translatable::resolve($tour->badge),
            'description' => Translatable::resolve($tour->summary),
            'content' => Translatable::resolve($tour->content),
            'highlights' => Translatable::resolveStringList($tour->highlights),
            'journeyOutline' => collect(is_array($itinerary) ? $itinerary : [])
                ->map(fn (mixed $day): array => [
                    'phase' => (string) (is_array($day) ? ($day['day'] ?? '') : ''),
                    'title' => (string) (is_array($day) ? ($day['title'] ?? '') : ''),
                    'summary' => (string) (is_array($day) ? ($day['summary'] ?? '') : ''),
                ])
                ->values()
                ->all(),
            'destinations' => array_values(array_filter([Translatable::resolve($tour->destination)])),
            'sidebarIdealFor' => sprintf(
                '%s · %s · Best %s',
                Translatable::resolve($tour->group_size ?? []),
                TourFilterOptionPresenter::labelFor(
                    TourFilterOptionType::Difficulty,
                    (string) $tour->difficulty,
                ),
                Translatable::resolve($tour->best_months ?? []),
            ),
            'inclusions' => Translatable::resolveStringList($tour->inclusions ?? []),
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
            'title' => Translatable::resolve($package->title),
            'tagline' => Translatable::resolve($package->tagline),
            'image' => self::coverDetailUrl($package),
            'durationDays' => $package->duration_days,
            'durationLabel' => Translatable::resolve($package->duration_label),
            'badge' => Translatable::resolve($package->badge),
            'priceLabel' => Translatable::resolve($package->price_estimate ?? []) ?: 'Custom quotation',
            'description' => Translatable::resolve($package->summary),
            'highlights' => Translatable::resolveStringList($package->highlights),
            'journeyOutline' => Translatable::resolveJsonList($package->journey_outline ?? []),
            'destinations' => Translatable::resolveStringList($package->key_destinations ?? []),
            'sidebarIdealFor' => Translatable::resolve($package->ideal_for),
            'inclusions' => Translatable::resolveStringList($package->included_services ?? []),
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
            'title' => Translatable::normalize($tour->title),
            'durationDays' => $tour->duration_days,
            'duration' => Translatable::normalize($tour->duration_label),
            'badge' => Translatable::normalize($tour->badge ?? []),
            'image' => self::coverCardUrl($tour),
            'description' => Translatable::normalize($tour->summary),
            'highlightsText' => Translatable::stringListToTextMap($tour->highlights ?? []),
            'highlights' => Translatable::resolveStringList($tour->highlights ?? []),
            'inclusions' => Translatable::resolveStringList($tour->inclusions ?? []),
            'includedServicesText' => Translatable::stringListToTextMap($tour->included_services ?? $tour->inclusions ?? []),
        ];

        if ($tour->isPackage()) {
            return array_merge($base, [
                'destination' => Translatable::normalize($tour->destination ?? []),
                'region' => (string) ($tour->region ?? 'Multiple Regions'),
                'tagline' => Translatable::normalize($tour->tagline ?? []),
                'featuredPerks' => Translatable::resolveStringList($tour->highlights ?? []),
                'keyDestinations' => Translatable::resolveStringList($tour->key_destinations ?? []),
                'keyDestinationsText' => Translatable::stringListToTextMap($tour->key_destinations ?? []),
                'priceEstimate' => Translatable::normalize($tour->price_estimate ?? []),
                'idealFor' => Translatable::normalize($tour->ideal_for ?? []),
                'includedServices' => Translatable::resolveStringList($tour->included_services ?? []),
                'journeyOutline' => Translatable::normalizeJsonListStorage($tour->journey_outline ?? []),
                'isPopular' => (bool) $tour->is_popular,
            ]);
        }

        return array_merge($base, [
            'destination' => Translatable::normalize($tour->destination ?? []),
            'region' => (string) ($tour->region ?? ''),
            'difficulty' => (string) ($tour->difficulty ?? 'Moderate'),
            'travelStyle' => (string) ($tour->travel_style ?? 'Cultural & Heritage'),
            'season' => Translatable::normalize($tour->season ?? []),
            'bestMonths' => Translatable::normalize($tour->best_months ?? []),
            'groupSize' => Translatable::normalize($tour->group_size ?? []),
            'content' => Translatable::normalize($tour->content ?? []),
            'itineraryOverview' => Translatable::normalizeJsonListStorage($tour->itinerary_overview ?? []),
        ]);
    }

    /**
     * @param  list<string>  $destinationSlugs
     * @return array<string, mixed>
     */
    public static function publicTourPayload(Tour $tour, array $destinationSlugs = []): array
    {
        $priceLabel = Translatable::resolve($tour->estimated_starting_price ?? []);

        return [
            'id' => $tour->slug,
            'slug' => $tour->slug,
            'title' => Translatable::resolve($tour->title),
            'destination' => Translatable::resolve($tour->destination),
            'region' => TourFilterOptionPresenter::labelFor(
                TourFilterOptionType::Region,
                (string) $tour->region,
            ),
            'durationDays' => $tour->duration_days,
            'duration' => Translatable::resolve($tour->duration_label),
            'difficulty' => TourFilterOptionPresenter::labelFor(
                TourFilterOptionType::Difficulty,
                (string) $tour->difficulty,
            ),
            'travelStyle' => TourFilterOptionPresenter::labelFor(
                TourFilterOptionType::TravelStyle,
                (string) $tour->travel_style,
            ),
            'regionValue' => (string) $tour->region,
            'difficultyValue' => (string) $tour->difficulty,
            'travelStyleValue' => (string) $tour->travel_style,
            'season' => Translatable::resolve($tour->season ?? []),
            'bestMonths' => Translatable::resolve($tour->best_months ?? []),
            'groupSize' => Translatable::resolve($tour->group_size ?? []),
            'image' => self::coverCardUrl($tour),
            'badge' => Translatable::resolve($tour->badge),
            'description' => Translatable::resolve($tour->summary),
            'content' => Translatable::resolve($tour->content),
            'highlights' => Translatable::resolveStringList($tour->highlights),
            'itineraryOverview' => Translatable::resolveJsonList($tour->itinerary_overview ?? []),
            'inclusions' => Translatable::resolveStringList($tour->inclusions ?? []),
            'priceLabel' => $priceLabel !== '' ? $priceLabel : null,
            'destinationSlugs' => array_values($destinationSlugs),
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
            'title' => Translatable::resolve($package->title),
            'tagline' => Translatable::resolve($package->tagline),
            'duration' => Translatable::resolve($package->duration_label),
            'durationDays' => $package->duration_days,
            'badge' => Translatable::resolve($package->badge) ?: 'Package',
            'image' => self::coverCardUrl($package),
            'description' => Translatable::resolve($package->summary),
            'featuredPerks' => Translatable::resolveStringList($package->highlights),
            'keyDestinations' => Translatable::resolveStringList($package->key_destinations ?? []),
            'priceEstimate' => Translatable::resolve($package->price_estimate ?? []) ?: 'Custom quotation',
            'idealFor' => Translatable::resolve($package->ideal_for),
            'includedServices' => Translatable::resolveStringList($package->included_services ?? []),
            'journeyOutline' => Translatable::resolveJsonList($package->journey_outline ?? []),
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
            'title' => Translatable::resolve($tour->title),
            'tagline' => Translatable::resolve($tour->summary),
            'image' => self::coverCardUrl($tour),
            'durationDays' => $tour->duration_days,
            'durationLabel' => Translatable::resolve($tour->duration_label),
            'badge' => Translatable::resolve($tour->badge),
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
            'title' => Translatable::resolve($package->title),
            'tagline' => Translatable::resolve($package->tagline),
            'image' => self::coverCardUrl($package),
            'durationDays' => $package->duration_days,
            'durationLabel' => Translatable::resolve($package->duration_label),
            'badge' => Translatable::resolve($package->badge),
            'priceLabel' => Translatable::resolve($package->price_estimate ?? []) ?: 'Custom quotation',
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
