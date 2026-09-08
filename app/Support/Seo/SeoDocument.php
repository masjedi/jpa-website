<?php

namespace App\Support\Seo;

use App\Support\Locale;

class SeoDocument
{
    /**
     * @param  list<array<string, mixed>>|null  $jsonLd
     * @return array<string, mixed>
     */
    public static function make(
        string $title,
        string $description,
        string $path,
        ?string $image = null,
        string $ogType = 'website',
        bool $noIndex = false,
        ?array $jsonLd = null,
    ): array {
        $canonical = SeoUrl::fromRequestPath($path);
        $ogImage = SeoImage::resolve($image);
        $locale = app()->getLocale();
        $ogLocale = (string) (config('seo.og_locales.'.$locale) ?? Locale::htmlLang($locale));
        $robots = $noIndex
            ? 'noindex, nofollow, noarchive, nosnippet'
            : 'index, follow';
        $cleanTitle = trim($title);
        $cleanDescription = SeoCopy::excerpt($description);
        $documentTitle = self::documentTitle($cleanTitle);

        return [
            'title' => $cleanTitle,
            'documentTitle' => $documentTitle,
            'description' => $cleanDescription,
            'canonical' => $canonical,
            'robots' => $robots,
            'noIndex' => $noIndex,
            'ogType' => $ogType,
            'ogTitle' => $cleanTitle,
            'ogDescription' => $cleanDescription,
            'ogUrl' => $canonical,
            'ogImage' => $ogImage,
            'ogLocale' => $ogLocale,
            'twitterTitle' => $cleanTitle,
            'twitterDescription' => $cleanDescription,
            'twitterImage' => $ogImage,
            'jsonLd' => $jsonLd ?? [],
        ];
    }

    public static function documentTitle(string $title): string
    {
        $suffix = (string) config('seo.title_suffix', 'Journey to Peace');

        if ($title === '' || $title === $suffix) {
            return $suffix;
        }

        return $title.' - '.$suffix;
    }

    public static function translation(string $key, string $fallback = ''): string
    {
        $value = data_get(Locale::publicTranslations(), $key);

        return is_string($value) && trim($value) !== '' ? trim($value) : $fallback;
    }
}
