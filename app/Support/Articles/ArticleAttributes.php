<?php

namespace App\Support\Articles;

use App\Enums\ArticleStatus;
use App\Models\Article;

final class ArticleAttributes
{
    private const DEFAULT_AUTHOR_NAME = 'Sara Ahmad';

    private const DEFAULT_AUTHOR_ROLE = 'Lead travel editor';

    private const DEFAULT_AUTHOR_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80';

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated, ?Article $existing = null): array
    {
        $content = (string) $validated['content'];
        $status = ArticleStatus::fromFrontend((string) $validated['status']);

        $attributes = [
            'status' => $status,
            'title' => (string) $validated['title'],
            'summary' => (string) $validated['summary'],
            'category' => (string) $validated['category'],
            'content' => $content,
            'reading_time_minutes' => ArticleText::readingTimeMinutes($content),
            'author_name' => self::DEFAULT_AUTHOR_NAME,
            'author_role' => self::DEFAULT_AUTHOR_ROLE,
            'author_avatar' => self::DEFAULT_AUTHOR_AVATAR,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'related_tour_slugs' => $existing?->related_tour_slugs ?? [],
        ];

        if ($status === ArticleStatus::Published) {
            if ($existing === null || $existing->status !== ArticleStatus::Published) {
                $attributes['published_at'] = now();
            }
        } else {
            $attributes['published_at'] = null;
        }

        return $attributes;
    }
}
