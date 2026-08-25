<?php

namespace App\Support\Articles;

use App\Models\Article;
use App\Models\TeamMember;
use App\Models\Tour;
use App\Support\Team\TeamMemberPresenter;

class ArticlePresenter
{
    /**
     * @return array{articles: list<array<string, mixed>>, teamMembers: list<array{id: int, name: string, role: string}>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'articles' => Article::query()
                ->with('teamMember')
                ->latestFirst()
                ->get()
                ->map(fn (Article $article): array => self::adminPayload($article))
                ->values()
                ->all(),
            'teamMembers' => TeamMember::query()
                ->ordered()
                ->get()
                ->map(fn (TeamMember $member): array => self::teamMemberOptionPayload($member))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{articles: list<array<string, mixed>>}
     */
    public static function forPublicIndex(): array
    {
        return [
            'articles' => Article::query()
                ->published()
                ->with('teamMember')
                ->featuredFirst()
                ->get()
                ->map(fn (Article $article): array => self::publicCardPayload($article))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(int $limit = 3): array
    {
        return Article::query()
            ->published()
            ->with('teamMember')
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->map(fn (Article $article): array => self::publicCardPayload($article))
            ->values()
            ->all();
    }

    /**
     * @return array{
     *     article: array<string, mixed>,
     *     relatedArticles: list<array<string, mixed>>,
     *     relatedTours: list<array<string, mixed>>
     * }
     */
    public static function forPublicShow(Article $article): array
    {
        return [
            'article' => self::publicDetailPayload($article),
            'relatedArticles' => self::relatedArticlePayloads($article),
            'relatedTours' => self::relatedTourPayloads($article),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(Article $article): array
    {
        return [
            'id' => $article->id,
            'slug' => $article->slug,
            'status' => $article->status->frontendLabel(),
            'title' => (string) $article->title,
            'summary' => (string) $article->summary,
            'category' => (string) $article->category,
            'image' => self::coverCardUrl($article),
            'content' => (string) $article->content,
            'date' => self::displayDate($article),
            'readingTimeMinutes' => (int) $article->reading_time_minutes,
            'teamMemberId' => $article->team_member_id,
            'author' => self::authorPayload($article),
            'isFeatured' => (bool) $article->is_featured,
            'relatedTourSlugs' => $article->related_tour_slugs ?? [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicCardPayload(Article $article): array
    {
        return [
            'id' => $article->slug,
            'slug' => $article->slug,
            'title' => (string) $article->title,
            'summary' => (string) $article->summary,
            'category' => (string) $article->category,
            'image' => self::coverCardUrl($article),
            'date' => self::displayDate($article),
            'readingTimeMinutes' => (int) $article->reading_time_minutes,
            'author' => self::authorPayload($article),
            'isFeatured' => (bool) $article->is_featured,
            'content' => (string) $article->content,
            'sections' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicDetailPayload(Article $article): array
    {
        return [
            'id' => $article->slug,
            'slug' => $article->slug,
            'title' => (string) $article->title,
            'summary' => (string) $article->summary,
            'category' => (string) $article->category,
            'image' => self::coverDetailUrl($article),
            'date' => self::displayDate($article),
            'readingTimeMinutes' => (int) $article->reading_time_minutes,
            'author' => self::authorPayload($article),
            'isFeatured' => (bool) $article->is_featured,
            'content' => (string) $article->content,
            'sections' => [],
            'relatedTourSlugs' => $article->related_tour_slugs ?? [],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function relatedArticlePayloads(Article $current, int $limit = 3): array
    {
        $candidates = Article::query()
            ->published()
            ->with('teamMember')
            ->where('slug', '!=', $current->slug)
            ->featuredFirst()
            ->get();

        $sameCategory = $candidates->filter(
            fn (Article $article): bool => (string) $article->category === (string) $current->category,
        );
        $others = $candidates->reject(
            fn (Article $article): bool => (string) $article->category === (string) $current->category,
        );

        return $sameCategory
            ->concat($others)
            ->take($limit)
            ->map(fn (Article $article): array => self::publicCardPayload($article))
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function relatedTourPayloads(Article $article, int $limit = 4): array
    {
        $slugs = collect($article->related_tour_slugs ?? [])
            ->map(fn ($slug) => trim((string) $slug))
            ->filter()
            ->values();

        if ($slugs->isEmpty()) {
            return [];
        }

        return Tour::query()
            ->published()
            ->whereIn('slug', $slugs->all())
            ->latestFirst()
            ->get()
            ->take($limit)
            ->map(fn (Tour $tour): array => [
                'id' => $tour->slug,
                'slug' => $tour->slug,
                'title' => (string) $tour->title,
                'duration' => (string) $tour->duration_label,
                'href' => '/tours/'.$tour->slug,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{name: string, role: string, avatar?: string}
     */
    private static function authorPayload(Article $article): array
    {
        if ($article->teamMember !== null) {
            return TeamMemberPresenter::authorPayload($article->teamMember);
        }

        $payload = [
            'name' => (string) $article->author_name,
            'role' => (string) $article->author_role,
        ];

        if (filled($article->author_avatar)) {
            $payload['avatar'] = (string) $article->author_avatar;
        }

        return $payload;
    }

    /**
     * @return array{id: int, name: string, role: string}
     */
    private static function teamMemberOptionPayload(TeamMember $member): array
    {
        return [
            'id' => $member->id,
            'name' => (string) $member->name,
            'role' => (string) $member->role,
        ];
    }

    private static function displayDate(Article $article): string
    {
        return ArticleText::formattedDate($article->published_at ?? $article->created_at);
    }

    private static function coverCardUrl(Article $article): string
    {
        return $article->coverAsset()?->cardUrl()
            ?? $article->coverImageUrl()
            ?? '';
    }

    private static function coverDetailUrl(Article $article): string
    {
        return $article->coverAsset()?->detailUrl()
            ?? $article->coverImageUrl()
            ?? '';
    }
}
