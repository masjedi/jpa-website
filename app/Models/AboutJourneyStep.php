<?php

namespace App\Models;

use App\Enums\AboutJourneyStepStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'status',
    'title',
    'description',
    'image_media',
    'image_alt',
    'icon_key',
    'sort_order',
])]
class AboutJourneyStep extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AboutJourneyStepStatus::class,
            'title' => 'array',
            'description' => 'array',
            'image_alt' => 'array',
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

    /**
     * @param  Builder<AboutJourneyStep>  $query
     * @return Builder<AboutJourneyStep>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', AboutJourneyStepStatus::Published);
    }

    /**
     * @param  Builder<AboutJourneyStep>  $query
     * @return Builder<AboutJourneyStep>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
