<?php

namespace App\Support;

class Locale
{
    public static function direction(?string $locale = null): string
    {
        $normalizedLocale = str_replace('-', '_', $locale ?? app()->getLocale());

        return in_array($normalizedLocale, config('app.rtl_locales', []), true) ? 'rtl' : 'ltr';
    }

    public static function htmlLang(?string $locale = null): string
    {
        return str_replace('_', '-', $locale ?? app()->getLocale());
    }
}
