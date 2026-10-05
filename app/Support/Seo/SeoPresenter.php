<?php

namespace App\Support\Seo;

use App\Models\Article;
use App\Models\Destination;
use App\Models\Tour;
use App\Support\About\AboutPagePresenter;
use App\Support\Translatable;

class SeoPresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function home(): array
    {
        return SeoDocument::make(
            title: SeoDocument::translation('seo.pages.home.title', 'Private Afghanistan Tours'),
            description: SeoDocument::translation(
                'seo.pages.home.description',
                'Explore private Afghanistan tours with trusted local guides. Discover Kabul, Bamiyan, Herat, Panjshir and more through carefully planned journeys.',
            ),
            path: '/',
            jsonLd: SeoJsonLd::home(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function page(string $key, string $path): array
    {
        return SeoDocument::make(
            title: SeoDocument::translation("seo.pages.{$key}.title"),
            description: SeoDocument::translation("seo.pages.{$key}.description"),
            path: $path,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function discovery(string $view): array
    {
        return match ($view) {
            'packages' => self::page('packages', '/tours?view=packages'),
            'destinations' => self::page('destinations', '/tours?view=destinations'),
            default => self::page('tours', '/tours'),
        };
    }

    /**
     * @return array<string, mixed>
     */
    public static function about(): array
    {
        $intro = (string) data_get(AboutPagePresenter::forPublic(), 'content.intro.description', '');

        return SeoDocument::make(
            title: SeoDocument::translation('seo.pages.about.title', 'About Us'),
            description: SeoCopy::excerpt($intro) !== ''
                ? $intro
                : SeoDocument::translation('seo.pages.about.description'),
            path: '/about',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function tour(Tour $tour): array
    {
        $title = Translatable::resolve($tour->title);
        $description = self::listingDescription($tour);
        $path = '/tours/'.$tour->slug;
        $image = $tour->coverImageUrl();

        return SeoDocument::make(
            title: $title,
            description: $description,
            path: $path,
            image: $image,
            jsonLd: SeoJsonLd::touristTrip(
                name: $title,
                description: SeoCopy::excerpt($description),
                path: $path,
                image: $image,
                crumbs: [
                    ['name' => SeoDocument::translation('nav.home', 'Home'), 'path' => '/'],
                    ['name' => SeoDocument::translation('seo.pages.tours.title', 'Tours'), 'path' => '/tours'],
                    ['name' => $title, 'path' => $path],
                ],
            ),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function package(Tour $package): array
    {
        $title = Translatable::resolve($package->title);
        $description = self::listingDescription($package);
        $path = '/packages/'.$package->slug;
        $image = $package->coverImageUrl();

        return SeoDocument::make(
            title: $title,
            description: $description,
            path: $path,
            image: $image,
            jsonLd: SeoJsonLd::touristTrip(
                name: $title,
                description: SeoCopy::excerpt($description),
                path: $path,
                image: $image,
                crumbs: [
                    ['name' => SeoDocument::translation('nav.home', 'Home'), 'path' => '/'],
                    ['name' => SeoDocument::translation('seo.pages.tours.title', 'Tours'), 'path' => '/tours'],
                    ['name' => $title, 'path' => $path],
                ],
            ),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function destination(Destination $destination): array
    {
        $name = Translatable::resolve($destination->name);
        $description = SeoCopy::excerpt(Translatable::resolve($destination->description))
            ?: Translatable::resolve($destination->tagline);
        $path = '/destinations/'.$destination->slug;
        $image = $destination->coverImageUrl();

        return SeoDocument::make(
            title: $name,
            description: $description,
            path: $path,
            image: $image,
            jsonLd: SeoJsonLd::place(
                name: $name,
                description: SeoCopy::excerpt($description),
                path: $path,
                image: $image,
                crumbs: [
                    ['name' => SeoDocument::translation('nav.home', 'Home'), 'path' => '/'],
                    ['name' => SeoDocument::translation('seo.pages.destinations.title', 'Destinations'), 'path' => '/destinations'],
                    ['name' => $name, 'path' => $path],
                ],
            ),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function article(Article $article): array
    {
        $title = Translatable::resolve($article->title);
        $description = SeoCopy::excerpt(Translatable::resolve($article->summary))
            ?: Translatable::resolve($article->content);
        $path = '/articles/'.$article->slug;
        $image = $article->coverImageUrl();
        $published = $article->published_at ?? $article->created_at;

        return SeoDocument::make(
            title: $title,
            description: $description,
            path: $path,
            image: $image,
            ogType: 'article',
            jsonLd: SeoJsonLd::article(
                headline: $title,
                description: SeoCopy::excerpt($description),
                path: $path,
                image: $image,
                datePublished: $published?->toAtomString(),
                dateModified: $article->updated_at?->toAtomString(),
                crumbs: [
                    ['name' => SeoDocument::translation('nav.home', 'Home'), 'path' => '/'],
                    ['name' => SeoDocument::translation('seo.pages.articles.title', 'Articles'), 'path' => '/articles'],
                    ['name' => $title, 'path' => $path],
                ],
            ),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function privatePage(string $title, string $description, string $path): array
    {
        return SeoDocument::make(
            title: $title,
            description: $description,
            path: $path,
            noIndex: true,
        );
    }

    private static function listingDescription(Tour $listing): string
    {
        $summary = Translatable::resolve($listing->summary);
        $tagline = Translatable::resolve($listing->tagline);
        $content = Translatable::resolve($listing->content);

        return $summary !== '' ? $summary : ($tagline !== '' ? $tagline : $content);
    }
}
