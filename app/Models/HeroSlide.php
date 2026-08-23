<?php

namespace App\Models;

use App\Enums\HeroSlideStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['hero_section_id', 'title', 'subtitle', 'status', 'sort_order'])]
class HeroSlide extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => HeroSlideStatus::class,
            'sort_order' => 'integer',
        ];
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
}
