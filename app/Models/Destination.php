<?php

namespace App\Models;

use App\Enums\DestinationStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'slug',
    'status',
    'name',
    'tagline',
    'region',
    'badge',
    'cover_media',
    'description',
    'highlights',
    'best_season',
    'travel_style',
    'practical_notes',
    'tour_match_keywords',
    'is_featured',
])]
class Destination extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => DestinationStatus::class,
            'cover_media' => 'array',
            'highlights' => 'array',
            'practical_notes' => 'array',
            'tour_match_keywords' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    public function coverAsset(): ?MediaAsset
    {
        if (! is_array($this->cover_media) || $this->cover_media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($this->cover_media);
    }

    public function coverImageUrl(): ?string
    {
        return $this->coverAsset()?->detailUrl() ?? $this->coverAsset()?->cardUrl();
    }

    /**
     * @param  Builder<Destination>  $query
     * @return Builder<Destination>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', DestinationStatus::Published);
    }

    /**
     * @param  Builder<Destination>  $query
     * @return Builder<Destination>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('id');
    }

    /**
     * @param  Builder<Destination>  $query
     * @return Builder<Destination>
     */
    public function scopeFeaturedFirst(Builder $query): Builder
    {
        return $query->orderByDesc('is_featured')->orderByDesc('id');
    }
}
