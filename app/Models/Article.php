<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'slug',
    'status',
    'title',
    'summary',
    'category',
    'cover_media',
    'content',
    'reading_time_minutes',
    'team_member_id',
    'author_name',
    'author_role',
    'author_avatar',
    'is_featured',
    'related_tour_slugs',
    'published_at',
])]
class Article extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,
            'title' => 'array',
            'summary' => 'array',
            'content' => 'array',
            'cover_media' => 'array',
            'related_tour_slugs' => 'array',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function coverAsset(): ?MediaAsset
    {
        if (! is_array($this->cover_media) || $this->cover_media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($this->cover_media);
    }

    /**
     * @return BelongsTo<TeamMember, $this>
     */
    public function teamMember(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class);
    }

    public function coverImageUrl(): ?string
    {
        return $this->coverAsset()?->detailUrl() ?? $this->coverAsset()?->cardUrl();
    }

    /**
     * @param  Builder<Article>  $query
     * @return Builder<Article>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ArticleStatus::Published);
    }

    /**
     * @param  Builder<Article>  $query
     * @return Builder<Article>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }

    /**
     * @param  Builder<Article>  $query
     * @return Builder<Article>
     */
    public function scopeFeaturedFirst(Builder $query): Builder
    {
        return $query->orderByDesc('is_featured')->orderByDesc('published_at')->orderByDesc('id');
    }
}
