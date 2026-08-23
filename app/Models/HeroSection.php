<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['eyebrow'])]
class HeroSection extends Model
{
    public static function current(): self
    {
        return static::query()->firstOrCreate(
            [],
            ['eyebrow' => 'Premium guided travel in Afghanistan'],
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
