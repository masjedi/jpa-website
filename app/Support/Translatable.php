<?php

namespace App\Support;

class Translatable
{
    /**
     * @return list<string>
     */
    public static function localeCodes(): array
    {
        return array_keys(config('app.supported_locales', []));
    }

    /**
     * @return array<string, string>
     */
    public static function normalize(array|string|null $value): array
    {
        $locales = self::localeCodes();
        $normalized = [];

        foreach ($locales as $locale) {
            $normalized[$locale] = '';
        }

        if (is_string($value)) {
            $normalized['en'] = trim($value);

            return $normalized;
        }

        if (! is_array($value)) {
            return $normalized;
        }

        foreach ($locales as $locale) {
            $normalized[$locale] = trim((string) ($value[$locale] ?? ''));
        }

        return $normalized;
    }

    public static function resolve(array|string|null $value, ?string $locale = null): string
    {
        $map = self::normalize($value);
        $locale = $locale ?? app()->getLocale();

        $resolved = trim((string) ($map[$locale] ?? ''));

        if ($resolved !== '') {
            return $resolved;
        }

        $english = trim((string) ($map['en'] ?? ''));

        if ($english !== '') {
            return $english;
        }

        foreach ($map as $text) {
            $candidate = trim((string) $text);

            if ($candidate !== '') {
                return $candidate;
            }
        }

        return '';
    }

    /**
     * @param  array<string, string>  $values
     * @return array<string, string>
     */
    public static function sanitize(array $values): array
    {
        $normalized = self::normalize($values);

        foreach ($normalized as $locale => $text) {
            $normalized[$locale] = trim($text);
        }

        return $normalized;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public static function normalizeStringList(array|string|null $value): array
    {
        $locales = self::localeCodes();
        $normalized = [];

        foreach ($locales as $locale) {
            $normalized[$locale] = [];
        }

        if (is_string($value)) {
            $normalized['en'] = self::linesFromText($value);

            return $normalized;
        }

        if (! is_array($value)) {
            return $normalized;
        }

        if (array_is_list($value)) {
            return self::normalizeStringListStorage($value);
        }

        foreach ($locales as $locale) {
            $items = $value[$locale] ?? [];

            if (is_string($items)) {
                $normalized[$locale] = self::linesFromText($items);
            } elseif (is_array($items)) {
                $normalized[$locale] = self::sanitizeListItems($items);
            }
        }

        return $normalized;
    }

    /**
     * @param  list<string>|array<string, list<string>>|null  $value
     * @return array<string, list<string>>
     */
    public static function normalizeStringListStorage(?array $value): array
    {
        $locales = self::localeCodes();
        $normalized = [];

        foreach ($locales as $locale) {
            $normalized[$locale] = [];
        }

        if ($value === null || $value === []) {
            return $normalized;
        }

        if (array_is_list($value)) {
            $normalized['en'] = self::sanitizeListItems($value);

            return $normalized;
        }

        foreach ($locales as $locale) {
            $items = $value[$locale] ?? [];
            $normalized[$locale] = is_array($items) ? self::sanitizeListItems($items) : [];
        }

        return $normalized;
    }

    /**
     * @return list<string>
     */
    public static function resolveStringList(array|string|null $value, ?string $locale = null): array
    {
        $map = self::normalizeStringListStorage(is_string($value) ? self::normalizeStringList($value) : $value);
        $locale = $locale ?? app()->getLocale();

        return self::firstNonEmptyList($map, $locale);
    }

    /**
     * @param  list<mixed>|array<string, list<mixed>>|null  $value
     * @return array<string, list<mixed>>
     */
    public static function normalizeJsonListStorage(?array $value): array
    {
        $locales = self::localeCodes();
        $normalized = [];

        foreach ($locales as $locale) {
            $normalized[$locale] = [];
        }

        if ($value === null || $value === []) {
            return $normalized;
        }

        if (array_is_list($value)) {
            $normalized['en'] = $value;

            return $normalized;
        }

        foreach ($locales as $locale) {
            $items = $value[$locale] ?? [];
            $normalized[$locale] = is_array($items) ? array_values($items) : [];
        }

        return $normalized;
    }

    /**
     * @return list<mixed>
     */
    public static function resolveJsonList(?array $value, ?string $locale = null): array
    {
        $map = self::normalizeJsonListStorage($value);
        $locale = $locale ?? app()->getLocale();

        return self::firstNonEmptyList($map, $locale);
    }

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, list<string>>
     */
    public static function sanitizeStringListFromText(array $values): array
    {
        $normalized = [];

        foreach (self::localeCodes() as $locale) {
            $normalized[$locale] = self::linesFromText((string) ($values[$locale] ?? ''));
        }

        return $normalized;
    }

    /**
     * @return array<string, string>
     */
    public static function stringListToTextMap(array|string|null $value): array
    {
        $map = self::normalizeStringListStorage(is_string($value) ? self::normalizeStringList($value) : $value);
        $textMap = [];

        foreach (self::localeCodes() as $locale) {
            $textMap[$locale] = implode("\n", $map[$locale] ?? []);
        }

        return $textMap;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public static function validationRules(string $prefix, int $maxLength = 255, bool $requireEnglish = true): array
    {
        $rules = [
            $prefix => ['required', 'array'],
        ];

        foreach (self::localeCodes() as $locale) {
            $rules["{$prefix}.{$locale}"] = array_values(array_filter([
                $locale === 'en' && $requireEnglish ? 'required' : 'nullable',
                'string',
                "max:{$maxLength}",
            ]));
        }

        return $rules;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public static function validationRulesOptional(string $prefix, int $maxLength = 255): array
    {
        return self::validationRules($prefix, $maxLength, requireEnglish: false);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public static function validationRulesForStringListText(
        string $prefix,
        int $maxLength = 10000,
        bool $requireEnglish = true,
    ): array {
        $rules = [
            $prefix => ['required', 'array'],
        ];

        foreach (self::localeCodes() as $locale) {
            $rules["{$prefix}.{$locale}"] = array_values(array_filter([
                $locale === 'en' && $requireEnglish ? 'required' : 'nullable',
                'string',
                "max:{$maxLength}",
            ]));
        }

        return $rules;
    }

    /**
     * @param  list<mixed>  $items
     * @return list<string>
     */
    private static function sanitizeListItems(array $items): array
    {
        return array_values(array_filter(array_map(
            static fn (mixed $item): string => trim((string) $item),
            $items,
        ), static fn (string $item): bool => $item !== ''));
    }

    /**
     * @param  array<string, list<mixed>>  $map
     * @return list<mixed>
     */
    private static function firstNonEmptyList(array $map, string $locale): array
    {
        $preferred = $map[$locale] ?? [];

        if ($preferred !== []) {
            return array_values($preferred);
        }

        $english = $map['en'] ?? [];

        if ($english !== []) {
            return array_values($english);
        }

        foreach ($map as $items) {
            if (is_array($items) && $items !== []) {
                return array_values($items);
            }
        }

        return [];
    }

    /**
     * @return list<string>
     */
    private static function linesFromText(string $value): array
    {
        if (trim($value) === '') {
            return [];
        }

        return array_values(array_filter(array_map(
            static fn (string $line): string => trim($line),
            preg_split('/\R+/', $value) ?: [],
        ), static fn (string $line): bool => $line !== ''));
    }
}
