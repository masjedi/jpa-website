<?php

namespace Tests\Feature;

use App\Enums\ArticleStatus;
use App\Enums\DestinationStatus;
use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Article;
use App\Models\Destination;
use App\Models\Tour;
use App\Support\Seo\SeoDocument;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PublicSeoTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{0: string, 1: string}>
     */
    public static function publicSeoPageProvider(): array
    {
        return [
            'home' => ['/', 'Private Afghanistan Tours'],
            'tours' => ['/tours', 'Tours and Packages'],
            'packages' => ['/tours?view=packages', 'Tour Packages'],
            'destinations' => ['/tours?view=destinations', 'Destinations'],
            'services' => ['/services', 'Travel Services'],
            'articles' => ['/articles', 'Travel Articles'],
            'about' => ['/about', 'About Us'],
            'team' => ['/about/team', 'Our Team'],
            'gallery' => ['/gallery', 'Travel Gallery'],
            'contact' => ['/contact', 'Contact and Inquiry'],
            'privacy' => ['/privacy', 'Privacy Policy'],
            'terms' => ['/terms', 'Terms and Conditions'],
        ];
    }

    #[DataProvider('publicSeoPageProvider')]
    public function test_public_pages_include_single_title_description_and_canonical(string $path, string $title): void
    {
        $html = $this->get($path)->assertOk()->getContent();
        $head = $this->documentHead($html);

        $this->assertSame(1, preg_match_all('/<title\b/i', $head));
        $this->assertSame(1, preg_match_all('/name="description"/', $head));
        $this->assertSame(1, preg_match_all('/rel="canonical"/', $head));
        $this->assertStringContainsString(SeoDocument::documentTitle($title), $head);
        $this->assertStringContainsString('property="og:locale"', $head);
        $this->assertStringContainsString('name="twitter:card"', $head);
        $this->assertStringNotContainsString('name="keywords"', $head);
        $this->assertStringNotContainsString('noindex, nofollow, noarchive, nosnippet', $head);
    }

    #[Test]
    public function test_home_includes_organization_json_ld(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $head = $this->documentHead($html);

        $this->assertStringContainsString('application/ld+json', $head);
        $this->assertStringContainsString('"TravelAgency"', $head);
        $this->assertStringContainsString('"WebSite"', $head);
        $this->assertMatchesRegularExpression('/property="og:image" content="https?:\/\/[^"]+"/', $head);
        $this->assertTrue(
            str_contains($head, '/images/seo/home-og.jpg') || str_contains($head, '/brand/logo-color-h.png'),
            'The homepage should use the default Open Graph image or the site logo.',
        );

        preg_match('/<script type="application\/ld\+json" inertia="json-ld">(.*?)<\/script>/s', $head, $matches);

        $this->assertNotEmpty($matches[1] ?? null);
        $decoded = json_decode($matches[1], true);
        $this->assertIsArray($decoded);
        $this->assertSame(JSON_ERROR_NONE, json_last_error());
        $this->assertSame('https://schema.org', $decoded['@context'] ?? null);
        $this->assertNotEmpty($decoded['@graph'] ?? null);
    }

    #[Test]
    public function test_detail_pages_use_record_data_and_structured_markup(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'bamiyan-heritage',
            'title' => 'Bamiyan Heritage Journey',
            'summary' => '<p>A guided highland itinerary through Bamiyan valleys, cliff monasteries and lake roads with local hosts.</p>',
        ]));

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'bamiyan-valley',
            'name' => 'Bamiyan Valley',
            'description' => '<p>Alpine lakes, cliff monasteries and highland silence in the Central Highlands of Afghanistan.</p>',
        ]));

        Article::query()->create($this->articleAttributes([
            'slug' => 'packing-for-spring',
            'title' => 'Packing for spring travel',
            'summary' => '<p>Practical packing advice for changing temperatures, mountain weather and comfortable travel during spring.</p>',
        ]));

        $tourHtml = $this->get('/tours/bamiyan-heritage')->assertOk()->getContent();
        $this->assertStringContainsString('Bamiyan Heritage Journey', $tourHtml);
        $this->assertStringContainsString('TouristTrip', $tourHtml);
        $this->assertStringContainsString('BreadcrumbList', $tourHtml);

        $destinationHtml = $this->get('/destinations/bamiyan-valley')->assertOk()->getContent();
        $this->assertStringContainsString('Bamiyan Valley', $destinationHtml);
        $this->assertStringContainsString('"Place"', $destinationHtml);

        $articleHtml = $this->get('/articles/packing-for-spring')->assertOk()->getContent();
        $this->assertStringContainsString('Packing for spring travel', $articleHtml);
        $this->assertStringContainsString('"Article"', $articleHtml);
    }

    #[Test]
    public function test_sitemap_includes_published_records_and_skips_drafts(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'published-tour',
            'title' => 'Published Tour',
        ]));
        Tour::query()->create($this->tourAttributes([
            'slug' => 'draft-tour',
            'title' => 'Draft Tour',
            'status' => TourListingStatus::Draft,
        ]));
        Tour::query()->create($this->packageAttributes([
            'slug' => 'published-package',
            'title' => 'Published Package',
        ]));
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'published-destination',
            'name' => 'Published Destination',
        ]));
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'draft-destination',
            'name' => 'Draft Destination',
            'status' => DestinationStatus::Draft,
        ]));
        Article::query()->create($this->articleAttributes([
            'slug' => 'published-article',
            'title' => 'Published Article',
        ]));
        Article::query()->create($this->articleAttributes([
            'slug' => 'draft-article',
            'title' => 'Draft Article',
            'status' => ArticleStatus::Draft,
        ]));

        $xml = $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=utf-8')
            ->getContent();

        $this->assertStringContainsString('/tours?view=packages', $xml);
        $this->assertStringContainsString('/tours?view=destinations', $xml);
        $this->assertStringContainsString('/tours/published-tour', $xml);
        $this->assertStringContainsString('/packages/published-package', $xml);
        $this->assertStringContainsString('/destinations/published-destination', $xml);
        $this->assertStringContainsString('/articles/published-article', $xml);
        $this->assertStringContainsString('<lastmod>', $xml);
        $this->assertStringNotContainsString('/tours/draft-tour', $xml);
        $this->assertStringNotContainsString('/destinations/draft-destination', $xml);
        $this->assertStringNotContainsString('/articles/draft-article', $xml);
        $this->assertStringNotContainsString('/admin', $xml);
    }

    #[Test]
    public function test_admin_login_stays_fully_noindex(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('noindex, nofollow, noarchive, nosnippet', false);
    }

    #[Test]
    public function test_www_host_redirects_to_the_canonical_domain(): void
    {
        config(['app.url' => 'https://journey-to-afghanistan.com']);

        $this->get('http://www.journey-to-afghanistan.com/tours?ref=guide')
            ->assertRedirect('https://journey-to-afghanistan.com/tours?ref=guide')
            ->assertStatus(301);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function tourAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-tour',
            'listing_type' => TourListingType::Tour,
            'status' => TourListingStatus::Published,
            'title' => Translatable::normalize('Sample Tour'),
            'summary' => Translatable::normalize('Sample summary for a published tour listing used in SEO tests.'),
            'destination' => Translatable::normalize('Bamiyan'),
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'duration_label' => Translatable::normalize('7 Days / 6 Nights'),
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'cover_media' => null,
        ], $this->normalizeOverrides($overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function packageAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-package',
            'listing_type' => TourListingType::Package,
            'status' => TourListingStatus::Published,
            'title' => Translatable::normalize('Sample Package'),
            'tagline' => Translatable::normalize('Sample tagline'),
            'summary' => Translatable::normalize('Sample package summary used for sitemap and metadata tests.'),
            'destination' => Translatable::normalize('Kabul'),
            'region' => 'Multiple Regions',
            'duration_days' => 7,
            'duration_label' => Translatable::normalize('7 Days / 6 Nights'),
            'cover_media' => null,
        ], $this->normalizeOverrides($overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function destinationAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-destination',
            'status' => DestinationStatus::Published,
            'name' => Translatable::normalize('Sample Destination'),
            'tagline' => Translatable::normalize('A highland destination'),
            'region' => 'Central Highlands',
            'badge' => Translatable::normalize('Signature'),
            'description' => Translatable::normalize('A published destination used for SEO metadata and sitemap tests.'),
            'highlights' => ['Highlight one'],
            'best_season' => Translatable::normalize('May – October'),
            'travel_style' => Translatable::normalize('Cultural & nature'),
            'practical_notes' => ['Note one'],
            'tour_match_keywords' => ['Sample'],
            'is_featured' => false,
            'cover_media' => null,
        ], $this->normalizeOverrides($overrides, ['name', 'tagline', 'description', 'badge', 'best_season', 'travel_style']));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function articleAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-article',
            'status' => ArticleStatus::Published,
            'title' => Translatable::normalize('Sample Article'),
            'summary' => Translatable::normalize('A published article summary used for SEO metadata and sitemap tests.'),
            'category' => 'Travel tips',
            'content' => Translatable::normalize('<p>Article body</p>'),
            'reading_time_minutes' => 4,
            'author_name' => 'Editorial Team',
            'author_role' => '',
            'cover_media' => null,
            'published_at' => now(),
        ], $this->normalizeOverrides($overrides, ['title', 'summary', 'content']));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @param  list<string>  $fields
     * @return array<string, mixed>
     */
    private function normalizeOverrides(array $overrides, array $fields = ['title', 'tagline', 'summary', 'destination', 'duration_label', 'content', 'name', 'description']): array
    {
        foreach ($fields as $field) {
            if (isset($overrides[$field]) && is_string($overrides[$field])) {
                $overrides[$field] = Translatable::normalize($overrides[$field]);
            }
        }

        return $overrides;
    }

    private function documentHead(string $html): string
    {
        preg_match('/<head\b[^>]*>(.*?)<\/head>/is', $html, $matches);

        $this->assertNotEmpty($matches[1] ?? null, 'The response is missing a document head.');

        return $matches[1];
    }
}
