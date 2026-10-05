<?php

namespace App\Support\Seo;

class SeoUrl
{
    public static function absolute(string $path = '/'): string
    {
        if (self::isAbsolute($path)) {
            return $path;
        }

        $base = rtrim(self::base(), '/');
        $normalized = '/'.ltrim($path, '/');

        if ($normalized === '/') {
            return $base.'/';
        }

        return $base.$normalized;
    }

    public static function fromRequestPath(string $path): string
    {
        $parts = parse_url($path);
        $clean = is_string($parts['path'] ?? null) && $parts['path'] !== ''
            ? $parts['path']
            : '/';
        $canonical = self::absolute($clean);

        $query = [];
        if (is_string($parts['query'] ?? null) && $parts['query'] !== '') {
            parse_str($parts['query'], $query);
        }

        $view = is_string($query['view'] ?? null) ? $query['view'] : null;

        if (in_array($view, ['packages', 'destinations'], true)) {
            return $canonical.'?'.http_build_query(['view' => $view]);
        }

        return $canonical;
    }

    public static function base(): string
    {
        return rtrim((string) config('app.url'), '/');
    }

    public static function isAbsolute(string $value): bool
    {
        return str_starts_with($value, 'https://') || str_starts_with($value, 'http://');
    }
}
