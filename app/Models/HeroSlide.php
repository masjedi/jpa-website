<?php

namespace App\Models;

use App\Enums\HeroSlideStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['hero_section_id', 'title', 'subtitle', 'image_media', 'status', 'sort_order'])]
class HeroSlide extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'image_media' => 'array',
            'title' => 'array',
            'subtitle' => 'array',
            'status' => HeroSlideStatus::class,
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
     * @return BelongsTo<HeroSection, $this>
     */
    public function heroSection(): BelongsTo
    {
        return $this->belongsTo(HeroSection::class);
    }

    /**
     * @param  Builder<HeroSlide>  $query
     * @return Builder<HeroSlide>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', HeroSlideStatus::Published);
    }

    /**
     * @param  Builder<HeroSlide>  $query
     * @return Builder<HeroSlide>
     */
    public function scopeOrderedForCarousel(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * @param  Builder<HeroSlide>  $query
     * @return Builder<HeroSlide>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('id');
    }

    /**
     * @param  Builder<HeroSlide>  $query
     * @return Builder<HeroSlide>
     */
    public function scopeWithHeroImage(Builder $query): Builder
    {
        return $query->whereNotNull('image_media');
    }

    /**
     * Latest published slides with hero images for the public homepage carousel.
     *
     * @param  Builder<HeroSlide>  $query
     * @return Builder<HeroSlide>
     */
    public function scopeForPublicHero(Builder $query, int $limit = 5): Builder
    {
        return $query
            ->published()
            ->withHeroImage()
            ->latestFirst()
            ->limit($limit);
    }
}
