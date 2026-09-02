<?php

namespace Database\Seeders;

use App\Enums\ServiceOfferingCategory;
use App\Enums\ServiceOfferingStatus;
use App\Models\ServiceOffering;
use Illuminate\Database\Seeder;

class ServiceOfferingSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->catalog() as $index => $offering) {
            ServiceOffering::query()->updateOrCreate(
                ['slug' => $offering['slug']],
                [
                    'status' => ServiceOfferingStatus::Published,
                    'title' => $offering['title'],
                    'tagline' => $offering['tagline'],
                    'description' => $offering['description'],
                    'category' => $offering['category'],
                    'icon_key' => $offering['icon_key'],
                    'features' => $offering['features'],
                    'is_featured' => $offering['is_featured'],
                    'show_on_home' => $offering['show_on_home'],
                    'sort_order' => $index + 1,
                ],
            );
        }
    }

    /**
     * @return list<array{
     *     slug: string,
     *     title: string,
     *     tagline: string,
     *     description: string,
     *     category: ServiceOfferingCategory,
     *     icon_key: string,
     *     features: list<string>,
     *     is_featured: bool,
     *     show_on_home: bool
     * }>
     */
    private function catalog(): array
    {
        return [
            [
                'slug' => 'guided-tours',
                'title' => 'Guided tours',
                'tagline' => 'Small-group journeys with experienced local guides.',
                'description' => 'Join curated departures across Bamiyan, Herat, Kabul and beyond — led by guides who know the routes, culture and practical realities of travel in Afghanistan.',
                'category' => ServiceOfferingCategory::Journey,
                'icon_key' => 'users',
                'features' => [
                    'Fixed-date small-group departures',
                    'English-speaking Afghan lead guide',
                    'Permits and regional logistics included',
                ],
                'is_featured' => true,
                'show_on_home' => true,
            ],
            [
                'slug' => 'custom-itineraries',
                'title' => 'Custom itineraries',
                'tagline' => 'Routes shaped around your dates, pace and interests.',
                'description' => 'From photography expeditions to family heritage trips — our planners build bespoke routes that match how you want to travel, not a fixed template.',
                'category' => ServiceOfferingCategory::Journey,
                'icon_key' => 'route',
                'features' => [
                    'One-to-one consultation before you book',
                    'Flexible pacing and accommodation level',
                    'Special interests: culture, trekking, research',
                ],
                'is_featured' => true,
                'show_on_home' => true,
            ],
            [
                'slug' => 'private-tours',
                'title' => 'Private tours',
                'tagline' => 'Your own guide and vehicle, at your own pace.',
                'description' => 'Ideal for couples, families or small groups who want privacy, flexibility and direct access to a dedicated guide throughout the journey.',
                'category' => ServiceOfferingCategory::Journey,
                'icon_key' => 'user-check',
                'features' => [
                    'Private vehicle and vetted driver',
                    'Dedicated guide for your group only',
                    'Adjust daily plans on the ground',
                ],
                'is_featured' => false,
                'show_on_home' => true,
            ],
            [
                'slug' => 'local-guides',
                'title' => 'Local guides',
                'tagline' => 'Certified Afghan guides for city walks and specialist visits.',
                'description' => 'Day guides and regional specialists for museums, bazaars, archaeological sites and cultural encounters — with context you will not find in a guidebook.',
                'category' => ServiceOfferingCategory::OnGround,
                'icon_key' => 'map-pinned',
                'features' => [
                    'City, heritage and regional specialists',
                    'Cultural etiquette and translation support',
                    'Available for single days or full circuits',
                ],
                'is_featured' => false,
                'show_on_home' => true,
            ],
            [
                'slug' => 'transportation',
                'title' => 'Transport coordination',
                'tagline' => 'Reliable vehicles matched to your route and group size.',
                'description' => 'We arrange 4WD Land Cruisers, domestic flights and airport transfers through trusted drivers who know highland passes, city traffic and remote roads.',
                'category' => ServiceOfferingCategory::OnGround,
                'icon_key' => 'bus',
                'features' => [
                    '4WD vehicles for highland and remote routes',
                    'Domestic flight booking assistance',
                    'Airport meet-and-greet in Kabul',
                ],
                'is_featured' => false,
                'show_on_home' => true,
            ],
            [
                'slug' => 'accommodation',
                'title' => 'Accommodation coordination',
                'tagline' => 'Guesthouses and hotels chosen for comfort and character.',
                'description' => 'From boutique city hotels to heritage guesthouses in Bamiyan — we select stays for location, safety and authentic local hospitality.',
                'category' => ServiceOfferingCategory::OnGround,
                'icon_key' => 'bed-double',
                'features' => [
                    'Vetted hotels and heritage guesthouses',
                    'Group and solo room arrangements',
                    'Dietary needs communicated in advance',
                ],
                'is_featured' => false,
                'show_on_home' => true,
            ],
            [
                'slug' => 'visa-permits',
                'title' => 'Visa & permit support',
                'tagline' => 'Official LOI letters and provincial tourism permits.',
                'description' => 'We guide you through visa invitation letters, Ministry permits and regional access paperwork — so you arrive with documentation in order.',
                'category' => ServiceOfferingCategory::Logistics,
                'icon_key' => 'file-check-2',
                'features' => [
                    'Letter of Invitation (LOI) coordination',
                    'Provincial tourism and site permits',
                    'Pre-trip document checklist and advice',
                ],
                'is_featured' => false,
                'show_on_home' => false,
            ],
            [
                'slug' => 'safety-briefing',
                'title' => 'Safety & field briefing',
                'tagline' => 'Clear communication before and during your journey.',
                'description' => 'Every traveler receives a pre-departure briefing on routes, customs, dress and current ground realities — with 24/7 operations contact while in country.',
                'category' => ServiceOfferingCategory::Logistics,
                'icon_key' => 'shield-check',
                'features' => [
                    'Pre-trip safety and cultural briefing',
                    '24/7 Kabul operations contact',
                    'Route adjustments when conditions change',
                ],
                'is_featured' => false,
                'show_on_home' => false,
            ],
        ];
    }
}
