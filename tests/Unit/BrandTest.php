<?php

namespace Tests\Unit;

use App\Models\SiteSetting;
use App\Support\Brand;
use App\Support\SiteSettings\SiteSettingsDefaults;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandTest extends TestCase
{
    use RefreshDatabase;

    public function test_app_name_never_returns_laravel_default(): void
    {
        config(['app.name' => 'Laravel']);

        $this->assertSame(Brand::NAME, Brand::appName());
    }

    public function test_app_name_prefers_site_settings_brand_name(): void
    {
        config(['app.name' => 'Custom Agency Name']);

        SiteSetting::current()->update([
            'brand_name' => Translatable::normalize('Settings Brand Name'),
        ]);

        $this->assertSame('Settings Brand Name', Brand::appName());
    }

    public function test_app_name_falls_back_to_defaults_when_settings_missing(): void
    {
        config(['app.name' => 'Laravel']);

        $this->assertSame(SiteSettingsDefaults::BRAND_NAME, Brand::appName());
    }
}
