<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Support\SiteSettings\SiteSettingsDefaults;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->firstOrCreate([], SiteSettingsDefaults::attributes());
    }
}
