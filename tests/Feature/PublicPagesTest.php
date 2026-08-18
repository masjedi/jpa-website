<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
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

    public function test_unknown_tour_still_renders(): void
    {
        $this->get('/tours/does-not-exist')->assertOk();
    }
}
