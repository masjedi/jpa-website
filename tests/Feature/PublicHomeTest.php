<?php

namespace Tests\Feature;

use App\Enums\ArticleStatus;
use App\Enums\DestinationStatus;
use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Article;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourFilterOption;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicHomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_initial_load_excludes_deferred_preview_props(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'latest-tour',
            'title' => 'Latest Tour',
            'status' => TourListingStatus::Published,
        ]));

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'latest-destination',
            'name' => 'Latest Destination',
            'status' => DestinationStatus::Published,
        ]));

        Article::query()->create($this->articleAttributes([
            'slug' => 'latest-article',
            'title' => 'Latest Article',
            'status' => ArticleStatus::Published,
        ]));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->has('hero')
                ->has('finderOptions.destinations')
                ->has('finderOptions.travelStyles')
                ->has('finderOptions.seasons')
                ->has('finderOptions.groupTypes')
                ->has('homeServices')
                ->missing('featuredTours')
                ->missing('featuredDestinations')
                ->missing('galleryPreview')
                ->missing('latestArticles'));
    }

    public function test_home_page_deferred_preview_props_load_on_demand(): void
    {
        Tour::query()->create($this->tourAttributes([
            'slug' => 'draft-tour',
            'title' => 'Draft Tour',
            'status' => TourListingStatus::Draft,
        ]));

        Tour::query()->create($this->tourAttributes([
            'slug' => 'latest-tour',
            'title' => 'Latest Tour',
            'status' => TourListingStatus::Published,
        ]));

        Tour::query()->create($this->packageAttributes([
            'slug' => 'published-package',
            'title' => 'Published Package',
            'status' => TourListingStatus::Published,
        ]));

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'draft-destination',
            'name' => 'Draft Destination',
            'status' => DestinationStatus::Draft,
        ]));

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'latest-destination',
            'name' => 'Latest Destination',
            'status' => DestinationStatus::Published,
            'tagline' => 'Valleys, cliffs and calm lakes.',
        ]));

        Article::query()->create($this->articleAttributes([
            'slug' => 'draft-article',
            'title' => 'Draft Article',
            'status' => ArticleStatus::Draft,
        ]));

        Article::query()->create($this->articleAttributes([
            'slug' => 'latest-article',
            'title' => 'Latest Article',
            'status' => ArticleStatus::Published,
        ]));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->loadDeferredProps(fn ($page) => $page
                    ->has('featuredTours', 1)
                    ->where('featuredTours.0.slug', 'latest-tour')
                    ->where('featuredTours.0.title', 'Latest Tour')
                    ->has('featuredDestinations', 1)
                    ->where('featuredDestinations.0.slug', 'latest-destination')
                    ->where('featuredDestinations.0.name', 'Latest Destination')
                    ->where('featuredDestinations.0.tagline', 'Valleys, cliffs and calm lakes.')
                    ->has('latestArticles', 1)
                    ->where('latestArticles.0.slug', 'latest-article')
                    ->where('latestArticles.0.title', 'Latest Article')));
    }

    public function test_home_page_limits_each_preview_section(): void
    {
        foreach (range(1, 5) as $index) {
            Tour::query()->create($this->tourAttributes([
                'slug' => "tour-{$index}",
                'title' => "Tour {$index}",
                'status' => TourListingStatus::Published,
            ]));
        }

        foreach (range(1, 6) as $index) {
            Destination::query()->create($this->destinationAttributes([
                'slug' => "destination-{$index}",
                'name' => "Destination {$index}",
                'status' => DestinationStatus::Published,
            ]));
        }

        foreach (range(1, 5) as $index) {
            Article::query()->create($this->articleAttributes([
                'slug' => "article-{$index}",
                'title' => "Article {$index}",
                'status' => ArticleStatus::Published,
            ]));
        }

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->loadDeferredProps(fn ($page) => $page
                    ->has('featuredTours', 3)
                    ->where('featuredTours.0.slug', 'tour-5')
                    ->has('featuredDestinations', 4)
                    ->where('featuredDestinations.0.slug', 'destination-6')
                    ->has('latestArticles', 3)
                    ->where('latestArticles.0.slug', 'article-5')));
    }

    public function test_home_page_finder_receives_only_published_options(): void
    {
        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Destination,
            'name' => 'Bamiyan Valley',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Destination,
            'name' => 'Hidden Draft',
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
            'type' => TourFilterOptionType::Season,
            'name' => 'Spring',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::GroupType,
            'name' => 'Private tour',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->has('finderOptions.destinations', 1)
                ->where('finderOptions.destinations.0.value', 'Bamiyan Valley')
                ->where('finderOptions.destinations.0.label', 'Bamiyan Valley')
                ->has('finderOptions.travelStyles', 1)
                ->where('finderOptions.travelStyles.0.value', 'Cultural & Heritage')
                ->where('finderOptions.travelStyles.0.label', 'Cultural & Heritage')
                ->has('finderOptions.seasons', 1)
                ->where('finderOptions.seasons.0.value', 'Spring')
                ->where('finderOptions.seasons.0.label', 'Spring')
                ->has('finderOptions.groupTypes', 1)
                ->where('finderOptions.groupTypes.0.value', 'Private tour')
                ->where('finderOptions.groupTypes.0.label', 'Private tour'));
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
            'title' => 'Sample Tour',
            'summary' => 'Sample summary.',
            'destination' => 'Bamiyan',
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
        ], $overrides);
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
            'title' => 'Sample Package',
            'tagline' => 'Sample tagline',
            'summary' => 'Sample package summary.',
            'destination' => 'Kabul',
            'region' => 'Multiple Regions',
            'duration_days' => 7,
            'duration_label' => '7 Days / 6 Nights',
            'highlights' => ['Perk one'],
            'key_destinations' => ['Kabul'],
            'included_services' => ['Breakfast'],
            'price_estimate' => 'From $1,000 / person',
            'ideal_for' => 'First-time visitors',
            'cover_media' => null,
        ], $overrides);
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
            'description' => '<p>Description</p>',
            'highlights' => ['Highlight'],
            'best_season' => 'Spring to autumn',
            'travel_style' => 'Cultural & Heritage',
            'practical_notes' => ['Note'],
            'tour_match_keywords' => ['Bamiyan'],
            'is_featured' => false,
            'cover_media' => null,
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function articleAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-article',
            'status' => ArticleStatus::Published,
            'title' => 'Sample Article',
            'summary' => 'Sample summary.',
            'category' => 'Travel tips',
            'content' => '<p>Content</p>',
            'author_name' => 'JPA Editorial',
            'author_role' => 'Travel team',
            'reading_time_minutes' => 5,
            'is_featured' => false,
            'related_tour_slugs' => [],
            'cover_media' => null,
        ], $overrides);
    }
}
