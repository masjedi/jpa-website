<?php

namespace App\Support\Articles;

use App\Models\Article;
use Illuminate\Support\Str;

final class ArticleSlug
{
    public static function unique(string $title, ?int $exceptId = null): string
    {
        $base = Str::slug($title);

        if ($base === '') {
            $base = 'article';
        }

        $slug = $base;
        $suffix = 2;

        while (Article::query()
            ->where('slug', $slug)
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
