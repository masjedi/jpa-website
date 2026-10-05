<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminSectionsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{0: string, 1: string}>
     */
    public static function adminSectionProvider(): array
    {
        return [
            'dashboard' => ['/admin/dashboard', 'admin/Dashboard'],
            'hero-section' => ['/admin/hero-section', 'admin/HeroSection'],
            'tours' => ['/admin/tours', 'admin/Tours'],
            'destinations' => ['/admin/destinations', 'admin/Destinations'],
            'services' => ['/admin/services', 'admin/Services'],
            'articles' => ['/admin/articles', 'admin/Articles'],
            'gallery' => ['/admin/gallery', 'admin/Gallery'],
            'faq' => ['/admin/faq', 'admin/Faq'],
            'teams' => ['/admin/teams', 'admin/Teams'],
            'subscriptions' => ['/admin/subscriptions', 'admin/Subscriptions'],
            'inquiries' => ['/admin/inquiries', 'admin/Inquiries'],
            'bookings' => ['/admin/bookings', 'admin/Bookings'],
            'emergency-contacts' => ['/admin/emergency-contacts', 'admin/EmergencyContacts'],
            'invoices' => ['/admin/invoices', 'admin/Invoices'],
            'settings' => ['/admin/settings', 'admin/Settings'],
        ];
    }

    #[DataProvider('adminSectionProvider')]
    public function test_authenticated_admin_can_access_sections(string $path, string $component): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get($path)
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component($component));
    }

    #[DataProvider('adminSectionProvider')]
    public function test_guest_cannot_access_sections(string $path, string $component): void
    {
        $this->get($path)->assertRedirect(route('admin.login'));
    }
}
