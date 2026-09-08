<?php

namespace App\Support\Seo;

use App\Support\Brand;
use App\Support\SiteSettings\SiteSettingsPresenter;

class SeoJsonLd
{
    /**
     * @param  list<array<string, mixed>>  $graph
     * @return array<string, mixed>
     */
    public static function document(array $graph): array
    {
        return [
            '@context' => 'https://schema.org',
            '@graph' => array_values($graph),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function home(): array
    {
        $settings = SiteSettingsPresenter::forShared();
        $url = SeoUrl::absolute('/');
        $logo = SeoImage::default();
        $name = Brand::appName();

        $organization = [
            '@type' => 'TravelAgency',
            '@id' => $url.'#organization',
            'name' => $name,
            'url' => $url,
            'image' => $logo,
            'logo' => $logo,
        ];

        $email = trim((string) ($settings['contactEmail'] ?? ''));

        if ($email !== '') {
            $organization['email'] = $email;
        }

        $sameAs = collect($settings['socialLinks'] ?? [])
            ->pluck('href')
            ->filter(fn (mixed $href): bool => is_string($href) && $href !== '')
            ->values()
            ->all();

        if ($sameAs !== []) {
            $organization['sameAs'] = $sameAs;
        }

        $location = trim((string) ($settings['officeLocation'] ?? ''));

        if ($location !== '') {
            $organization['areaServed'] = $location;
        }

        return [
            $organization,
            [
                '@type' => 'WebSite',
                '@id' => $url.'#website',
                'name' => $name,
                'url' => $url,
                'inLanguage' => app()->getLocale(),
                'publisher' => [
                    '@id' => $url.'#organization',
                ],
            ],
        ];
    }

    /**
     * @param  list<array{name: string, path: string}>  $crumbs
     * @return list<array<string, mixed>>
     */
    public static function touristTrip(
        string $name,
        string $description,
        string $path,
        ?string $image = null,
        array $crumbs = [],
    ): array {
        $url = SeoUrl::absolute($path);
        $trip = [
            '@type' => 'TouristTrip',
            'name' => $name,
            'description' => $description,
            'url' => $url,
        ];

        $resolvedImage = $image ? SeoImage::resolve($image) : null;

        if ($resolvedImage !== null) {
            $trip['image'] = $resolvedImage;
        }

        return array_values(array_filter([
            $trip,
            self::breadcrumb($crumbs),
        ]));
    }

    /**
     * @param  list<array{name: string, path: string}>  $crumbs
     * @return list<array<string, mixed>>
     */
    public static function place(
        string $name,
        string $description,
        string $path,
        ?string $image = null,
        array $crumbs = [],
    ): array {
        $url = SeoUrl::absolute($path);
        $place = [
            '@type' => 'Place',
            'name' => $name,
            'description' => $description,
            'url' => $url,
        ];

        if ($image) {
            $place['image'] = SeoImage::resolve($image);
        }

        return array_values(array_filter([
            $place,
            self::breadcrumb($crumbs),
        ]));
    }

    /**
     * @param  list<array{name: string, path: string}>  $crumbs
     * @return list<array<string, mixed>>
     */
    public static function article(
        string $headline,
        string $description,
        string $path,
        ?string $image = null,
        ?string $datePublished = null,
        ?string $dateModified = null,
        array $crumbs = [],
    ): array {
        $url = SeoUrl::absolute($path);
        $article = [
            '@type' => 'Article',
            'headline' => $headline,
            'description' => $description,
            'mainEntityOfPage' => $url,
            'url' => $url,
        ];

        if ($image) {
            $article['image'] = SeoImage::resolve($image);
        }

        if ($datePublished) {
            $article['datePublished'] = $datePublished;
        }

        if ($dateModified) {
            $article['dateModified'] = $dateModified;
        }

        return array_values(array_filter([
            $article,
            self::breadcrumb($crumbs),
        ]));
    }

    /**
     * @param  list<array{name: string, path: string}>  $crumbs
     * @return array<string, mixed>|null
     */
    public static function breadcrumb(array $crumbs): ?array
    {
        if ($crumbs === []) {
            return null;
        }

        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($crumbs)
                ->values()
                ->map(fn (array $crumb, int $index): array => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $crumb['name'],
                    'item' => SeoUrl::absolute($crumb['path']),
                ])
                ->all(),
        ];
    }
}
