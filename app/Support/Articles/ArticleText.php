<?php

namespace App\Support\Articles;

final class ArticleText
{
    public static function readingTimeMinutes(string $html): int
    {
        $text = trim(strip_tags($html));

        if ($text === '') {
            return 1;
        }

        $words = preg_split('/\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);

        return max(1, (int) round(count($words ?: []) / 200));
    }

    public static function formattedDate(?\DateTimeInterface $date): string
    {
        if ($date === null) {
            return '';
        }

        return $date->format('j M Y');
    }
}
