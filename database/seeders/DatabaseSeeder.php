<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            ProvinceSeeder::class,
            HeroSectionSeeder::class,
            SiteSettingsSeeder::class,
            AboutPageSeeder::class,
            LegalPageSeeder::class,
            TourFilterOptionSeeder::class,
            TourSeeder::class,
            DestinationSeeder::class,
            TeamMemberSeeder::class,
            FaqItemSeeder::class,
            ServiceOfferingSeeder::class,
        ]);
    }
}
