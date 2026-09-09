<?php

namespace App\Support\Seo;

use App\Models\Article;
use App\Models\Destination;
use App\Models\Tour;
use DateTimeInterface;
use Illuminate\Support\Facades\Cache;

class SitemapBuilder
{
    public static function xml(): string
    {
        $ttl = (int) config('seo.sitemap_cache_seconds', 3600);

        return Cache::remember('seo.sitemap.xml', $ttl, fn (): string => self::render());
    }

    public static function forget(): void
    {
        Cache::forget('seo.sitemap.xml');
    }

    public static function render(): string
    {
        $urls = collect(self::staticPages())
            ->concat(self::publishedTours())
            ->concat(self::publishedPackages())
            ->concat(self::publishedDestinations())
            ->concat(self::publishedArticles());

        $body = $urls
            ->map(function (array $entry): string {
                $loc = htmlspecialchars($entry['loc'], ENT_XML1);
                $lastmod = htmlspecialchars($entry['lastmod'], ENT_XML1);

                return "    <url>\n        <loc>{$loc}</loc>\n        <lastmod>{$lastmod}</lastmod>\n        <changefreq>weekly</changefreq>\n    </url>";
            })
            ->implode("\n");

        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{$body}
</urlset>
XML;
    }

    /**
     * @return list<array{loc: string, lastmod: string}>
     */
    private static function staticPages(): array
    {
        $today = now()->toDateString();

        return collect([
            '/',
            '/tours',
            '/tours?view=packages',
            '/tours?view=destinations',
            '/services',
            '/articles',
            '/about',
            '/about/team',
            '/gallery',
            '/contact',
            '/privacy',
            '/terms',
        ])->map(fn (string $path): array => [
            'loc' => str_contains($path, '?')
                ? SeoUrl::fromRequestPath($path)
                : SeoUrl::absolute($path),
            'lastmod' => $today,
        ])->all();
    }

    /**
     * @return list<array{loc: string, lastmod: string}>
     */
    private static function publishedTours(): array
    {
        return Tour::query()
            ->published()
            ->tours()
            ->get(['slug', 'updated_at'])
            ->map(fn (Tour $tour): array => [
                'loc' => SeoUrl::absolute('/tours/'.$tour->slug),
                'lastmod' => self::lastmod($tour->updated_at),
            ])
            ->all();
    }

    /**
     * @return list<array{loc: string, lastmod: string}>
     */
    private static function publishedPackages(): array
    {
        return Tour::query()
            ->published()
            ->packages()
            ->get(['slug', 'updated_at'])
            ->map(fn (Tour $tour): array => [
                'loc' => SeoUrl::absolute('/packages/'.$tour->slug),
                'lastmod' => self::lastmod($tour->updated_at),
            ])
            ->all();
    }

    /**
     * @return list<array{loc: string, lastmod: string}>
     */
    private static function publishedDestinations(): array
    {
        return Destination::query()
            ->published()
            ->get(['slug', 'updated_at'])
            ->map(fn (Destination $destination): array => [
                'loc' => SeoUrl::absolute('/destinations/'.$destination->slug),
                'lastmod' => self::lastmod($destination->updated_at),
            ])
            ->all();
    }

    /**
     * @return list<array{loc: string, lastmod: string}>
     */
    private static function publishedArticles(): array
    {
        return Article::query()
            ->published()
            ->get(['slug', 'updated_at', 'published_at'])
            ->map(fn (Article $article): array => [
                'loc' => SeoUrl::absolute('/articles/'.$article->slug),
                'lastmod' => self::lastmod($article->updated_at ?? $article->published_at),
            ])
            ->all();
    }

    private static function lastmod(?DateTimeInterface $date): string
    {
        return ($date ?? now())->format('Y-m-d');
    }
}
