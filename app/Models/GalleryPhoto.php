<?php

namespace App\Models;

use App\Enums\GalleryPhotoStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'status',
    'alt',
    'caption',
    'image_media',
    'sort_order',
])]
class GalleryPhoto extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => GalleryPhotoStatus::class,
            'alt' => 'array',
            'caption' => 'array',
            'image_media' => 'array',
            'sort_order' => 'integer',
        ];
    }

    public function imageAsset(): ?MediaAsset
    {
        if (! is_array($this->image_media) || $this->image_media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($this->image_media);
    }

    public function imageUrl(): ?string
    {
        return $this->imageAsset()?->detailUrl() ?? $this->imageAsset()?->cardUrl();
    }

    /**
     * @param  Builder<GalleryPhoto>  $query
     * @return Builder<GalleryPhoto>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', GalleryPhotoStatus::Published);
    }

    /**
     * @param  Builder<GalleryPhoto>  $query
     * @return Builder<GalleryPhoto>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('id');
    }
}
