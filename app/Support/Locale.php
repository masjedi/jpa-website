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
        $path = lang_path("{$locale}/public.json");

        if (! is_file($path)) {
            $fallback = (string) config('app.fallback_locale', 'en');
            $path = lang_path("{$fallback}/public.json");
        }

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
}
