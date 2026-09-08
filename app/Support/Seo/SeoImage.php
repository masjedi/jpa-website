<?php

namespace App\Support\Seo;

class SeoImage
{
    public static function resolve(?string $path = null): string
    {
        $candidate = is_string($path) ? trim($path) : '';

        if ($candidate !== '') {
            return SeoUrl::absolute($candidate);
        }

        return self::default();
    }

    public static function default(): string
    {
        foreach ([config('seo.default_og_path'), config('seo.logo_fallback')] as $path) {
            $relative = ltrim((string) $path, '/');

            if ($relative !== '' && is_file(public_path($relative))) {
                return SeoUrl::absolute($relative);
            }
        }

        return SeoUrl::absolute((string) config('seo.logo_fallback', 'brand/logo-color-h.png'));
    }
}
