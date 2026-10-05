<?php

namespace App\Support;

class Locale
{
    /**
     * @return list<string>
     */
    public static function supportedCodes(): array
    {
        return array_keys(config('app.supported_locales', []));
    }

    public static function isSupported(string $locale): bool
    {
        return in_array($locale, self::supportedCodes(), true);
    }

    /**
     * @return array<string, array{label: string, native: string}>
     */
    public static function supported(): array
    {
        /** @var array<string, array{label: string, native: string}> */
        return config('app.supported_locales', []);
    }

    public static function direction(?string $locale = null): string
    {
        $normalizedLocale = str_replace('-', '_', $locale ?? app()->getLocale());

        return in_array($normalizedLocale, config('app.rtl_locales', []), true) ? 'rtl' : 'ltr';
    }

    public static function htmlLang(?string $locale = null): string
    {
        return str_replace('_', '-', $locale ?? app()->getLocale());
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicTranslations(?string $locale = null): array
    {
        $locale = $locale ?? app()->getLocale();
        $translations = self::loadPublicJson($locale);

        if ($locale === 'en') {
            return $translations;
        }

        return self::mergeTranslations(self::loadPublicJson('en'), $translations);
    }

    /**
     * @return array<string, mixed>
     */
    private static function loadPublicJson(string $locale): array
    {
        $path = lang_path("{$locale}/public.json");

        if (! is_file($path)) {
            return [];
        }

        $contents = file_get_contents($path);

        if ($contents === false) {
            return [];
        }

        $decoded = json_decode($contents, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param  array<string, mixed>  $base
     * @param  array<string, mixed>  $override
     * @return array<string, mixed>
     */
    private static function mergeTranslations(array $base, array $override): array
    {
        foreach ($override as $key => $value) {
            if (is_array($value) && is_array($base[$key] ?? null)) {
                $base[$key] = self::mergeTranslations($base[$key], $value);

                continue;
            }

            if ($value === null || $value === '') {
                continue;
            }

            $base[$key] = $value;
        }

        return $base;
    }
}
