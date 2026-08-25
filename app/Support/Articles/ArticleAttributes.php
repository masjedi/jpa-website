<?php

namespace App\Support\Articles;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\TeamMember;
use App\Support\Team\TeamMemberPresenter;

final class ArticleAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated, ?Article $existing = null): array
    {
        $content = (string) $validated['content'];
        $status = ArticleStatus::fromFrontend((string) $validated['status']);
        $teamMember = TeamMember::query()->findOrFail($validated['team_member_id']);

        $attributes = [
            'status' => $status,
            'title' => (string) $validated['title'],
            'summary' => (string) $validated['summary'],
            'category' => (string) $validated['category'],
            'content' => $content,
            'reading_time_minutes' => ArticleText::readingTimeMinutes($content),
            'team_member_id' => $teamMember->id,
            'author_name' => (string) $teamMember->name,
            'author_role' => (string) $teamMember->role,
            'author_avatar' => TeamMemberPresenter::avatarUrl($teamMember),
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
