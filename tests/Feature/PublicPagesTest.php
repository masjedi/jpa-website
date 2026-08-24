<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{0: string}>
     */
    public static function publicPageProvider(): array
    {
        return [
            'home' => ['/'],
            'tours' => ['/tours'],
            'destinations' => ['/destinations'],
            'services' => ['/services'],
            'articles' => ['/articles'],
            'about' => ['/about'],
            'our team' => ['/about/team'],
            'gallery' => ['/gallery'],
            'contact' => ['/contact'],
            'privacy' => ['/privacy'],
            'terms' => ['/terms'],
            'sitemap' => ['/sitemap.xml'],
        ];
    }

    #[DataProvider('publicPageProvider')]
    public function test_public_pages_respond_successfully(string $path): void
    {
        $this->get($path)->assertOk();
    }

    public function test_unknown_tour_returns_not_found(): void
    {
        $this->get('/tours/does-not-exist')->assertNotFound();
    }

    public function test_unknown_destination_returns_not_found(): void
    {
        $this->get('/destinations/does-not-exist')->assertNotFound();
    }

    public function test_client_review_pages_are_not_indexable(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('<meta name="robots" content="noindex, nofollow">', false);
    }

    public function test_client_review_robots_file_blocks_crawlers(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));

        $this->assertIsString($robots);
        $this->assertStringContainsString("User-agent: *\nDisallow: /", str_replace("\r\n", "\n", $robots));
    }
}
