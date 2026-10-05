<?php

namespace App\Support\Seo;

use Illuminate\Support\Str;

class SeoCopy
{
    public static function excerpt(?string $value, int $min = 140, int $max = 160): string
    {
        $plain = self::plainText((string) $value);

        if ($plain === '') {
            return '';
        }

        if (Str::length($plain) <= $max) {
            return $plain;
        }

        $truncated = Str::substr($plain, 0, $max);
        $lastSpace = mb_strrpos($truncated, ' ');

        if ($lastSpace !== false && $lastSpace >= $min) {
            $truncated = Str::substr($truncated, 0, $lastSpace);
        }

        return rtrim($truncated, " \t\n\r\0\x0B.,;:-");
    }

    public static function plainText(?string $value): string
    {
        $withSpaces = preg_replace('/<[^>]*>/u', ' ', (string) $value) ?? '';
        $decoded = html_entity_decode($withSpaces, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim((string) preg_replace('/\s+/u', ' ', $decoded));
    }
}
