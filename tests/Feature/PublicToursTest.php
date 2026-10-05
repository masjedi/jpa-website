<?php

namespace Tests\Feature;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;
use App\Models\TourFilterOption;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicToursTest extends TestCase
{
    use RefreshDatabase;

    public function test_tours_index_receives_only_published_listings(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'published-tour',
            'title' => 'Published Tour',
            'status' => TourListingStatus::Published,
            'listing_type' => TourListingType::Tour,
        ]));

        Tour::query()->create($this->tourAttributes([
            'slug' => 'draft-tour',
            'title' => 'Draft Tour',
            'status' => TourListingStatus::Draft,
            'listing_type' => TourListingType::Tour,
        ]));

        Tour::query()->create($this->packageAttributes([
            'slug' => 'published-package',
            'title' => 'Published Package',
            'status' => TourListingStatus::Published,
        ]));

        $this->get('/tours')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Tours')
                ->where('view', 'tours')
                ->has('tours', 1)
                ->has('packages', 0)
                ->has('filterOptions.regions')
                ->has('filterOptions.travelStyles')
                ->has('filterOptions.difficulties')
                ->where('tours.0.slug', 'published-tour'));

        $this->get('/tours?view=packages')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Tours')
                ->where('view', 'packages')
                ->has('packages', 1)
                ->has('tours', 0)
                ->where('packages.0.slug', 'published-package'));
    }

    public function test_tours_index_receives_only_published_filter_options(): void
    {
        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Region,
            'name' => 'Central Highlands',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Region,
            'name' => 'Hidden Draft Region',
            'status' => TourFilterOptionStatus::Draft,
            'sort_order' => 2,
        ]);

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::TravelStyle,
            'name' => 'Cultural & Heritage',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Difficulty,
            'name' => 'Moderate',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->get('/tours')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Tours')
                ->has('filterOptions.regions', 1)
                ->where('filterOptions.regions.0.value', 'Central Highlands')
                ->where('filterOptions.regions.0.label', 'Central Highlands')
                ->has('filterOptions.travelStyles', 1)
                ->where('filterOptions.travelStyles.0.value', 'Cultural & Heritage')
                ->where('filterOptions.travelStyles.0.label', 'Cultural & Heritage')
                ->has('filterOptions.difficulties', 1)
                ->where('filterOptions.difficulties.0.value', 'Moderate')
                ->where('filterOptions.difficulties.0.label', 'Moderate'));
    }

    public function test_published_tour_detail_page_receives_offer_payload(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'bamiyan-circuit',
            'title' => 'Bamiyan Circuit',
            'status' => TourListingStatus::Published,
            'listing_type' => TourListingType::Tour,
            'content' => '<p>Detailed tour content.</p>',
        ]));

        $this->get('/tours/bamiyan-circuit')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/TourShow')
                ->where('offer.slug', 'bamiyan-circuit')
                ->where('offer.title', 'Bamiyan Circuit')
                ->where('offer.kind', 'tour')
                ->where('offer.content', '<p>Detailed tour content.</p>'));
    }

    public function test_draft_or_missing_tour_detail_returns_not_found(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'draft-tour',
            'status' => TourListingStatus::Draft,
            'listing_type' => TourListingType::Tour,
        ]));

        $this->get('/tours/draft-tour')->assertNotFound();
        $this->get('/tours/missing-tour')->assertNotFound();
    }

    public function test_published_package_detail_page_receives_offer_payload(): void
    {
        Tour::query()->create($this->packageAttributes([
            'slug' => 'essentials-package',
            'title' => 'Essentials Package',
            'status' => TourListingStatus::Published,
        ]));

        $this->get('/packages/essentials-package')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/PackageShow')
                ->where('offer.slug', 'essentials-package')
                ->where('offer.kind', 'package'));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function tourAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-tour',
            'listing_type' => TourListingType::Tour,
            'status' => TourListingStatus::Published,
            'title' => Translatable::normalize('Sample Tour'),
            'summary' => Translatable::normalize('Sample summary.'),
            'destination' => Translatable::normalize('Bamiyan'),
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'duration_label' => Translatable::normalize('7 Days / 6 Nights'),
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'highlights' => Translatable::normalizeStringListStorage(['Highlight']),
            'content' => Translatable::normalize('<p>Content</p>'),
            'inclusions' => Translatable::normalizeStringListStorage(['Guide']),
            'estimated_starting_price' => Translatable::normalize('Custom inquiry basis'),
            'next_departure_date' => Translatable::normalize('On request'),
            'next_departure_status' => Translatable::normalize('Open for Inquiries'),
            'cover_media' => null,
        ], $this->normalizeTourOverrides($overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function packageAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-package',
            'listing_type' => TourListingType::Package,
            'status' => TourListingStatus::Published,
            'title' => Translatable::normalize('Sample Package'),
            'tagline' => Translatable::normalize('Sample tagline'),
            'summary' => Translatable::normalize('Sample package summary.'),
            'destination' => Translatable::normalize('Kabul'),
            'region' => 'Multiple Regions',
            'duration_days' => 7,
            'duration_label' => Translatable::normalize('7 Days / 6 Nights'),
            'highlights' => Translatable::normalizeStringListStorage(['Perk one']),
            'key_destinations' => Translatable::normalizeStringListStorage(['Kabul']),
            'included_services' => Translatable::normalizeStringListStorage(['Breakfast']),
            'price_estimate' => Translatable::normalize('From $1,000 / person'),
            'ideal_for' => Translatable::normalize('First-time visitors'),
            'cover_media' => null,
        ], $this->normalizeTourOverrides($overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function normalizeTourOverrides(array $overrides): array
    {
        $scalarFields = [
            'title', 'tagline', 'summary', 'destination', 'duration_label',
            'content', 'price_estimate', 'ideal_for', 'estimated_starting_price',
            'next_departure_date', 'next_departure_status', 'badge',
        ];

        foreach ($scalarFields as $field) {
            if (isset($overrides[$field]) && is_string($overrides[$field])) {
                $overrides[$field] = Translatable::normalize($overrides[$field]);
            }
        }

        foreach (['highlights', 'inclusions', 'key_destinations', 'included_services'] as $field) {
            if (isset($overrides[$field]) && is_array($overrides[$field]) && array_is_list($overrides[$field])) {
                $overrides[$field] = Translatable::normalizeStringListStorage($overrides[$field]);
            }
        }

        return $overrides;
    }
}
