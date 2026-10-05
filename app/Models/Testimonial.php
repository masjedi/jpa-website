<?php

namespace App\Models;

use App\Enums\TestimonialStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'status',
    'name',
    'journey',
    'text',
    'avatar_media',
    'rating',
    'sort_order',
])]
class Testimonial extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TestimonialStatus::class,
            'name' => 'array',
            'journey' => 'array',
            'text' => 'array',
            'avatar_media' => 'array',
            'rating' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function avatarAsset(): ?MediaAsset
    {
        if (! is_array($this->avatar_media) || $this->avatar_media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($this->avatar_media);
    }

    public function avatarImageUrl(): ?string
    {
        return $this->avatarAsset()?->cardUrl();
    }

    /**
     * @param  Builder<Testimonial>  $query
     * @return Builder<Testimonial>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', TestimonialStatus::Published);
    }

    /**
     * @param  Builder<Testimonial>  $query
     * @return Builder<Testimonial>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
