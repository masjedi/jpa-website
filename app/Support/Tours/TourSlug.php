<?php

namespace App\Support\Tours;

use App\Models\Tour;
use Illuminate\Support\Str;

final class TourSlug
{
    public static function unique(string $title, ?int $exceptId = null): string
    {
        $base = Str::slug($title);

        if ($base === '') {
            $base = 'listing';
        }

        $slug = $base;
        $suffix = 2;

        while (Tour::query()
            ->where('slug', $slug)
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
