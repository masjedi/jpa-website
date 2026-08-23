<?php

namespace Tests\Feature;

use App\Enums\DestinationStatus;
use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicDestinationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_destinations_index_receives_only_published_listings(): void
    {
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'published-destination',
            'name' => 'Published Destination',
            'status' => DestinationStatus::Published,
            'is_featured' => true,
        ]));

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'draft-destination',
            'name' => 'Draft Destination',
            'status' => DestinationStatus::Draft,
        ]));

        $this->get('/destinations')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Destinations')
                ->has('destinations', 1)
                ->where('destinations.0.slug', 'published-destination')
                ->where('destinations.0.name', 'Published Destination')
                ->where('destinations.0.isFeatured', true));
    }

    public function test_published_destination_detail_page_receives_payload(): void
    {
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'bamiyan-valley',
            'name' => 'Bamiyan Valley',
            'status' => DestinationStatus::Published,
            'description' => '<p>Detailed destination content.</p>',
            'tour_match_keywords' => ['Bamiyan'],
        ]));

        Tour::query()->create([
            'slug' => 'bamiyan-circuit',
            'listing_type' => TourListingType::Tour,
            'status' => TourListingStatus::Published,
            'title' => 'Bamiyan Circuit',
            'summary' => 'Sample summary.',
            'destination' => 'Bamiyan & Central Highlands',
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'duration_label' => '7 Days / 6 Nights',
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'highlights' => ['Highlight'],
            'content' => '<p>Content</p>',
            'inclusions' => ['Guide'],
            'estimated_starting_price' => 'Custom inquiry basis',
            'next_departure_date' => 'On request',
            'next_departure_status' => 'Open for Inquiries',
            'cover_media' => null,
        ]);

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'kabul',
            'name' => 'Kabul',
            'region' => 'Capital & East',
            'status' => DestinationStatus::Published,
        ]));

        $this->get('/destinations/bamiyan-valley')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/DestinationShow')
                ->where('destination.slug', 'bamiyan-valley')
                ->where('destination.name', 'Bamiyan Valley')
                ->where('destination.description', '<p>Detailed destination content.</p>')
                ->has('relatedTours', 1)
                ->where('relatedTours.0.slug', 'bamiyan-circuit')
                ->has('relatedDestinations', 1)
                ->where('relatedDestinations.0.slug', 'kabul'));
    }

    public function test_draft_or_missing_destination_detail_returns_not_found(): void
    {
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'draft-destination',
            'status' => DestinationStatus::Draft,
        ]));

        $this->get('/destinations/draft-destination')->assertNotFound();
        $this->get('/destinations/missing-destination')->assertNotFound();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function destinationAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-destination',
            'status' => DestinationStatus::Published,
            'name' => 'Sample Destination',
            'tagline' => 'Sample tagline.',
            'region' => 'Central Highlands',
            'badge' => 'Signature',
            'description' => '<p>Sample description.</p>',
            'highlights' => ['Highlight one'],
            'best_season' => 'May – October',
            'travel_style' => 'Cultural & nature',
            'practical_notes' => ['Note one'],
            'tour_match_keywords' => ['Sample'],
            'is_featured' => false,
            'cover_media' => null,
        ], $overrides);
    }
}
