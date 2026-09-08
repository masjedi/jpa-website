<?php

namespace App\Models;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Support\Translatable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'type',
    'value',
    'name',
    'status',
    'sort_order',
])]
class TourFilterOption extends Model
{
    protected static function booted(): void
    {
        static::creating(function (TourFilterOption $option): void {
            if (is_string($option->name)) {
                $option->value ??= trim($option->name);
                $option->name = Translatable::normalize($option->name);
            } elseif ($option->value === null && is_array($option->name)) {
                $option->value = Translatable::resolve($option->name, 'en');
            }
        });

        static::updating(function (TourFilterOption $option): void {
            if ($option->isDirty('name') && is_string($option->name)) {
                $option->name = Translatable::normalize($option->name);
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => TourFilterOptionType::class,
            'name' => 'array',
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
            ->pluck('value')
            ->map(fn (mixed $value): string => (string) $value)
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
            ->where($column, $this->value)
            ->exists();
    }
}
