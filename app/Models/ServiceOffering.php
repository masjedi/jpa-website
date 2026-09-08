<?php

namespace App\Models;

use App\Enums\ServiceOfferingCategory;
use App\Enums\ServiceOfferingStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'status',
    'title',
    'slug',
    'tagline',
    'description',
    'category',
    'icon_key',
    'features',
    'is_featured',
    'show_on_home',
    'sort_order',
])]
class ServiceOffering extends Model
{
    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_featured' => false,
        'show_on_home' => false,
        'sort_order' => 0,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ServiceOfferingStatus::class,
            'category' => ServiceOfferingCategory::class,
            'title' => 'array',
            'tagline' => 'array',
            'description' => 'array',
            'features' => 'array',
            'is_featured' => 'boolean',
            'show_on_home' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @param  Builder<ServiceOffering>  $query
     * @return Builder<ServiceOffering>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ServiceOfferingStatus::Published);
    }

    /**
     * @param  Builder<ServiceOffering>  $query
     * @return Builder<ServiceOffering>
     */
    public function scopeOnHome(Builder $query): Builder
    {
        return $query->where('show_on_home', true);
    }

    /**
     * @param  Builder<ServiceOffering>  $query
     * @return Builder<ServiceOffering>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
