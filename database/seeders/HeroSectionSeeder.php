<?php

namespace Database\Seeders;

use App\Enums\HeroSlideStatus;
use App\Models\HeroSection;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    /**
     * Seed the homepage hero section and slides.
     */
    public function run(): void
    {
        $section = HeroSection::query()->updateOrCreate(
            ['id' => 1],
            ['eyebrow' => 'Premium guided travel in Afghanistan'],
        );

        $slides = [
            [
                'title' => 'Discover Afghanistan with trusted local guidance',
                'subtitle' => 'Landscapes, heritage and hospitality — planned with people who know the country deeply.',
                'status' => HeroSlideStatus::Published,
                'sort_order' => 1,
            ],
            [
                'title' => 'Experience a country rich in stories and tradition',
                'subtitle' => 'Travel thoughtfully through ancient cities, dramatic valleys and welcoming communities.',
                'status' => HeroSlideStatus::Published,
                'sort_order' => 2,
            ],
            [
                'title' => 'Plan an Afghanistan journey shaped around you',
                'subtitle' => 'Explore at your pace with local insight, careful planning and personal support throughout.',
                'status' => HeroSlideStatus::Published,
                'sort_order' => 3,
            ],
            [
                'title' => 'Walk ancient routes with guides who know every valley',
                'subtitle' => 'A draft slide for the next homepage campaign — not yet visible on the public site.',
                'status' => HeroSlideStatus::Draft,
                'sort_order' => 4,
            ],
        ];

        foreach ($slides as $slide) {
            $section->slides()->updateOrCreate(
                [
                    'hero_section_id' => $section->id,
                    'sort_order' => $slide['sort_order'],
                ],
                [
                    'title' => $slide['title'],
                    'subtitle' => $slide['subtitle'],
                    'status' => $slide['status'],
                ],
            );
        }
    }
}
