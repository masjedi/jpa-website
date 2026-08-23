<?php

namespace App\Support\Destinations;

use App\Models\Destination;
use Illuminate\Support\Str;

final class DestinationSlug
{
    public static function unique(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name);

        if ($base === '') {
            $base = 'destination';
        }

        $slug = $base;
        $suffix = 2;

        while (Destination::query()
            ->where('slug', $slug)
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
