<?php

namespace App\Support\Articles;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\TeamMember;
use App\Support\Team\TeamMemberPresenter;
use App\Support\Translatable;

final class ArticleAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated, ?Article $existing = null): array
    {
        $content = Translatable::sanitize($validated['content']);
        $status = ArticleStatus::fromFrontend((string) $validated['status']);
        $teamMember = filled($validated['team_member_id'] ?? null)
            ? TeamMember::query()->find((int) $validated['team_member_id'])
            : null;

        $authorName = trim((string) ($validated['author_name'] ?? ''));
        $authorRole = trim((string) ($validated['author_role'] ?? ''));

        if ($teamMember !== null) {
            $authorName = $authorName !== '' ? $authorName : Translatable::resolve($teamMember->name);
            $authorRole = $authorRole !== '' ? $authorRole : Translatable::resolve($teamMember->role);
        }

        $attributes = [
            'status' => $status,
            'title' => Translatable::sanitize($validated['title']),
            'summary' => Translatable::sanitize($validated['summary']),
            'category' => (string) $validated['category'],
            'content' => $content,
            'reading_time_minutes' => ArticleText::readingTimeMinutes(Translatable::resolve($content)),
            'team_member_id' => $teamMember?->id,
            'author_name' => $authorName,
            'author_role' => $authorRole,
            'author_avatar' => $teamMember !== null
                ? TeamMemberPresenter::avatarUrl($teamMember)
                : ($existing?->author_avatar),
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
