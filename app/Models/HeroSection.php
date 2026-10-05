<?php

namespace App\Models;

use App\Support\Translatable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['eyebrow'])]
class HeroSection extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'eyebrow' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            [],
            ['eyebrow' => Translatable::normalize('Premium guided travel in Afghanistan')],
        );
    }

    /**
     * @return HasMany<HeroSlide, $this>
     */
    public function slides(): HasMany
    {
        return $this->hasMany(HeroSlide::class);
    }
}
