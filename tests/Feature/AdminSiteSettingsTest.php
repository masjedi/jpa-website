<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use App\Support\SiteSettings\SiteSettingsDefaults;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminSiteSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_settings(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/settings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Settings')
                ->has('settings')
                ->has('settings.socialLinks', 4)
                ->where('settings.brandName.en', SiteSettingsDefaults::BRAND_NAME)
                ->where('settings.contactEmail', SiteSettingsDefaults::CONTACT_EMAIL));
    }

    public function test_admin_can_update_settings_via_form_method_spoof_with_optional_maps(): void
    {
        $user = User::factory()->create();
        SiteSetting::current();

        $this->actingAs($user)
            ->post('/admin/settings', [
                '_method' => 'patch',
                'brand_name' => $this->translation('JPA Heritage Tours'),
                'contact_email' => 'hello@example.com',
                'whatsapp_display' => $this->translation('+93 700 000000'),
                'whatsapp_href' => 'https://wa.me/93700000000',
                'office_location' => $this->translation('Kabul, Afghanistan'),
                'office_maps_href' => '',
                'office_maps_embed_src' => '',
                'social_links' => [
                    ['label' => 'Instagram', 'href' => 'https://instagram.com/jpa'],
                    ['label' => 'Facebook', 'href' => ''],
                    ['label' => 'YouTube', 'href' => ''],
                    ['label' => 'LinkedIn', 'href' => ''],
                ],
            ])
            ->assertRedirect(route('admin.settings.index'))
            ->assertSessionHas('success');

        $settings = SiteSetting::query()->first();

        $this->assertNotNull($settings);
        $this->assertSame('JPA Heritage Tours', Translatable::resolve($settings->brand_name));
        $this->assertNull($settings->office_maps_href);
        $this->assertCount(1, $settings->social_links);
    }

    public function test_admin_can_update_site_identity_settings(): void
    {
        $user = User::factory()->create();
        SiteSetting::current();

        $this->actingAs($user)
            ->patch('/admin/settings', [
                'brand_name' => $this->translation('JPA Heritage Tours'),
                'contact_email' => 'hello@example.com',
                'whatsapp_display' => $this->translation('+93 700 000000'),
                'whatsapp_href' => 'https://wa.me/93700000000',
                'office_location' => $this->translation('Kabul, Afghanistan'),
                'office_maps_href' => 'https://www.google.com/maps/search/?api=1&query=Kabul',
                'office_maps_embed_src' => 'https://www.google.com/maps?q=Kabul&output=embed',
                'social_links' => [
                    ['label' => 'Instagram', 'href' => 'https://instagram.com/jpa'],
                    ['label' => 'Facebook', 'href' => 'https://facebook.com/jpa'],
                    ['label' => 'YouTube', 'href' => 'https://youtube.com/@jpa'],
                    ['label' => 'LinkedIn', 'href' => 'https://linkedin.com/company/jpa'],
                ],
            ])
            ->assertRedirect(route('admin.settings.index'))
            ->assertSessionHas('success');

        $settings = SiteSetting::query()->first();

        $this->assertNotNull($settings);
        $this->assertSame('JPA Heritage Tours', Translatable::resolve($settings->brand_name));
        $this->assertSame('hello@example.com', $settings->contact_email);
        $this->assertSame('+93 700 000000', Translatable::resolve($settings->whatsapp_display));
        $this->assertCount(4, $settings->social_links);
    }

    public function test_shared_site_settings_reflect_updates(): void
    {
        $user = User::factory()->create();
        $settings = SiteSetting::current();
        $settings->update([
            'brand_name' => Translatable::normalize('Updated Brand'),
            'contact_email' => 'updated@example.com',
        ]);

        $this->actingAs($user)
            ->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('siteSettings.brandName', 'Updated Brand')
                ->where('siteSettings.contactEmail', 'updated@example.com')
                ->where('appName', 'Updated Brand'));
    }

    public function test_admin_can_upload_brand_logos(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        SiteSetting::current();

        $this->actingAs($user)
            ->patch('/admin/settings', [
                'brand_name' => $this->translation(SiteSettingsDefaults::BRAND_NAME),
                'contact_email' => SiteSettingsDefaults::CONTACT_EMAIL,
                'whatsapp_display' => $this->translation(SiteSettingsDefaults::WHATSAPP_DISPLAY),
                'whatsapp_href' => SiteSettingsDefaults::WHATSAPP_HREF,
                'office_location' => $this->translation(SiteSettingsDefaults::OFFICE_LOCATION),
                'office_maps_href' => SiteSettingsDefaults::OFFICE_MAPS_HREF,
                'office_maps_embed_src' => SiteSettingsDefaults::OFFICE_MAPS_EMBED_SRC,
                'social_links' => SiteSettingsDefaults::socialLinks(),
                'logo_color' => UploadedFile::fake()->image('logo-color.png', 640, 160),
                'logo_white' => UploadedFile::fake()->image('logo-white.png', 640, 160),
            ])
            ->assertRedirect(route('admin.settings.index'));

        $settings = SiteSetting::query()->first();

        $this->assertNotNull($settings);
        $this->assertNotEmpty($settings->logo_color_media);
        $this->assertNotEmpty($settings->logo_white_media);
    }

    public function test_guest_cannot_update_settings(): void
    {
        $this->patch('/admin/settings', [
            'brand_name' => $this->translation('Nope'),
            'contact_email' => 'nope@example.com',
            'whatsapp_display' => $this->translation('+1 000'),
            'whatsapp_href' => 'https://wa.me/1000',
            'office_location' => $this->translation('Nowhere'),
            'social_links' => SiteSettingsDefaults::socialLinks(),
        ])->assertRedirect(route('admin.login'));
    }
}
