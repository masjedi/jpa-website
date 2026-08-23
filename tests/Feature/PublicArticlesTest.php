<?php

namespace Tests\Feature;

use App\Enums\ArticleStatus;
use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Article;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicArticlesTest extends TestCase
{
    use RefreshDatabase;

    public function test_articles_index_receives_only_published_listings(): void
    {
        Article::query()->create($this->articleAttributes([
            'slug' => 'published-article',
            'title' => 'Published Article',
            'status' => ArticleStatus::Published,
            'is_featured' => true,
        ]));

        Article::query()->create($this->articleAttributes([
            'slug' => 'draft-article',
            'title' => 'Draft Article',
            'status' => ArticleStatus::Draft,
        ]));

        $this->get('/articles')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Articles')
                ->has('articles', 1)
                ->where('articles.0.slug', 'published-article')
                ->where('articles.0.title', 'Published Article')
                ->where('articles.0.isFeatured', true));
    }

    public function test_published_article_detail_page_receives_payload(): void
    {
        Article::query()->create($this->articleAttributes([
            'slug' => 'spring-packing-guide',
            'title' => 'Spring packing guide',
            'status' => ArticleStatus::Published,
            'content' => '<p>Detailed article content.</p>',
            'related_tour_slugs' => ['bamiyan-circuit'],
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

        Article::query()->create($this->articleAttributes([
            'slug' => 'heritage-notes',
            'title' => 'Heritage notes',
            'category' => 'Heritage',
            'status' => ArticleStatus::Published,
        ]));

        $this->get('/articles/spring-packing-guide')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/ArticleShow')
                ->where('article.slug', 'spring-packing-guide')
                ->where('article.title', 'Spring packing guide')
                ->where('article.content', '<p>Detailed article content.</p>')
                ->has('relatedTours', 1)
                ->where('relatedTours.0.slug', 'bamiyan-circuit')
                ->has('relatedArticles', 1)
                ->where('relatedArticles.0.slug', 'heritage-notes'));
    }

    public function test_draft_or_missing_article_detail_returns_not_found(): void
    {
        Article::query()->create($this->articleAttributes([
            'slug' => 'draft-article',
            'status' => ArticleStatus::Draft,
        ]));

        $this->get('/articles/draft-article')->assertNotFound();
        $this->get('/articles/missing-article')->assertNotFound();
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
            'content' => '<p>Sample content.</p>',
            'reading_time_minutes' => 3,
            'author_name' => 'Sara Ahmad',
            'author_role' => 'Lead travel editor',
            'author_avatar' => null,
            'is_featured' => false,
            'related_tour_slugs' => [],
            'published_at' => now(),
            'cover_media' => null,
        ], $overrides);
    }
}
