<?php

namespace App\Models;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'type',
    'name',
    'status',
    'sort_order',
])]
class TourFilterOption extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => TourFilterOptionType::class,
            'status' => TourFilterOptionStatus::class,
            'sort_order' => 'integer',
        ];
    }

    /**
     * @param  Builder<TourFilterOption>  $query
     * @return Builder<TourFilterOption>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', TourFilterOptionStatus::Published);
    }

    /**
     * @param  Builder<TourFilterOption>  $query
     * @return Builder<TourFilterOption>
     */
    public function scopeOfType(Builder $query, TourFilterOptionType $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * @param  Builder<TourFilterOption>  $query
     * @return Builder<TourFilterOption>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('type')->orderBy('sort_order')->orderBy('id');
    }

    /**
     * @return list<string>
     */
    public static function namesFor(TourFilterOptionType $type, bool $publishedOnly = false): array
    {
        $query = static::query()->ofType($type)->ordered();

        if ($publishedOnly) {
            $query->published();
        }

        return $query
            ->pluck('name')
            ->map(fn (mixed $name): string => (string) $name)
            ->values()
            ->all();
    }

    public function isUsedByTours(): bool
    {
        $column = $this->type->tourColumn();

        if ($column === null) {
            return false;
        }

        return Tour::query()
            ->where($column, $this->name)
            ->exists();
    }
}
