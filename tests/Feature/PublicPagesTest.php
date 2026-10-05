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
            'tour packages' => ['/tours?view=packages'],
            'destinations discovery' => ['/tours?view=destinations'],
            'services' => ['/services'],
            'articles' => ['/articles'],
            'about' => ['/about'],
            'our team' => ['/about/team'],
            'gallery' => ['/gallery'],
            'booking' => ['/booking'],
            'contact' => ['/contact'],
            'privacy' => ['/privacy'],
            'terms' => ['/terms'],
            'sitemap' => ['/sitemap.xml'],
        ];
    }

    #[DataProvider('publicPageProvider')]
    public function test_public_pages_respond_successfully(string $path): void
    {
        if ($path === '/booking') {
            $this->get($path)->assertRedirect('/?custom_tour=1');

            return;
        }

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

    public function test_public_pages_are_indexable_while_admin_stays_blocked(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertDontSee('noindex, nofollow, noarchive, nosnippet', false);

        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('noindex, nofollow, noarchive, nosnippet', false);
    }

    public function test_robots_file_allows_public_pages_and_blocks_admin(): void
    {
        $robots = str_replace("\r\n", "\n", (string) file_get_contents(public_path('robots.txt')));

        $this->assertStringContainsString("User-agent: *\nAllow: /", $robots);
        $this->assertStringContainsString('Disallow: /admin', $robots);
        $this->assertStringContainsString('Sitemap: https://journey-to-afghanistan.com/sitemap.xml', $robots);
    }
}
