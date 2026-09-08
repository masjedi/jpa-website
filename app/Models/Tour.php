<?php

namespace App\Models;

use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'slug',
    'listing_type',
    'status',
    'title',
    'tagline',
    'summary',
    'destination',
    'region',
    'duration_days',
    'duration_label',
    'travel_style',
    'difficulty',
    'season',
    'best_months',
    'group_size',
    'badge',
    'cover_media',
    'content',
    'highlights',
    'itinerary_overview',
    'inclusions',
    'key_destinations',
    'included_services',
    'journey_outline',
    'estimated_starting_price',
    'price_estimate',
    'ideal_for',
    'next_departure_date',
    'next_departure_status',
    'is_popular',
])]
class Tour extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'listing_type' => TourListingType::class,
            'status' => TourListingStatus::class,
            'title' => 'array',
            'tagline' => 'array',
            'summary' => 'array',
            'destination' => 'array',
            'duration_days' => 'integer',
            'duration_label' => 'array',
            'badge' => 'array',
            'content' => 'array',
            'season' => 'array',
            'best_months' => 'array',
            'group_size' => 'array',
            'estimated_starting_price' => 'array',
            'price_estimate' => 'array',
            'ideal_for' => 'array',
            'next_departure_date' => 'array',
            'next_departure_status' => 'array',
            'cover_media' => 'array',
            'highlights' => 'array',
            'itinerary_overview' => 'array',
            'inclusions' => 'array',
            'key_destinations' => 'array',
            'included_services' => 'array',
            'journey_outline' => 'array',
            'is_popular' => 'boolean',
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
     * @param  Builder<Tour>  $query
     * @return Builder<Tour>
     */
    public function scopeTours(Builder $query): Builder
    {
        return $query->where('listing_type', TourListingType::Tour);
    }

    /**
     * @param  Builder<Tour>  $query
     * @return Builder<Tour>
     */
    public function scopePackages(Builder $query): Builder
    {
        return $query->where('listing_type', TourListingType::Package);
    }

    /**
     * @param  Builder<Tour>  $query
     * @return Builder<Tour>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', TourListingStatus::Published);
    }

    /**
     * @param  Builder<Tour>  $query
     * @return Builder<Tour>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('id');
    }

    public function isPackage(): bool
    {
        return $this->listing_type === TourListingType::Package;
    }
}
