<?php

namespace App\Support\Legal;

use App\Enums\LegalPageKey;
use App\Models\LegalPage;
use App\Support\Translatable;

class LegalPagePresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forPublic(LegalPageKey $key): array
    {
        $page = LegalPage::forKey($key);

        return [
            'document' => self::documentPayload($page),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forAdminIndex(): array
    {
        return collect(LegalPageKey::cases())
            ->map(fn (LegalPageKey $key): array => self::adminSummary(LegalPage::forKey($key)))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function forAdminEdit(LegalPageKey $key): array
    {
        $page = LegalPage::forKey($key);

        return [
            'page' => self::adminEditPayload($page),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function attributesFromValidated(array $validated): array
    {
        return [
            'eyebrow' => Translatable::sanitize($validated['eyebrow'] ?? []),
            'title' => Translatable::sanitize($validated['title'] ?? []),
            'intro' => Translatable::sanitize($validated['intro'] ?? []),
            'sections' => self::sanitizeSections($validated['sections'] ?? []),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function documentPayload(LegalPage $page): array
    {
        $sections = Translatable::resolveJsonList($page->sections);

        return [
            'key' => $page->key instanceof LegalPageKey ? $page->key->value : (string) $page->key,
            'eyebrow' => Translatable::resolve($page->eyebrow),
            'title' => Translatable::resolve($page->title),
            'intro' => Translatable::resolve($page->intro),
            'sections' => collect($sections)
                ->map(fn (mixed $section): array => self::publicSection($section))
                ->filter(fn (array $section): bool => $section['title'] !== '' || $section['body'] !== '')
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{title: string, body: string, linkHref: string|null, linkLabel: string|null}
     */
    private static function publicSection(mixed $section): array
    {
        $data = is_array($section) ? $section : [];

        $linkHref = trim((string) ($data['link_href'] ?? ''));
        $linkLabel = trim((string) ($data['link_label'] ?? ''));

        return [
            'title' => trim((string) ($data['title'] ?? '')),
            'body' => trim((string) ($data['body'] ?? '')),
            'linkHref' => $linkHref !== '' ? $linkHref : null,
            'linkLabel' => $linkLabel !== '' ? $linkLabel : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function adminSummary(LegalPage $page): array
    {
        $key = $page->key instanceof LegalPageKey ? $page->key : LegalPageKey::from((string) $page->key);

        return [
            'id' => $page->id,
            'key' => $key->value,
            'label' => $key->label(),
            'title' => Translatable::normalize($page->title),
            'updated' => optional($page->updated_at)->toDateString() ?? '',
            'sectionCount' => count(Translatable::resolveJsonList($page->sections, 'en')),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function adminEditPayload(LegalPage $page): array
    {
        $key = $page->key instanceof LegalPageKey ? $page->key : LegalPageKey::from((string) $page->key);

        return [
            'id' => $page->id,
            'key' => $key->value,
            'label' => $key->label(),
            'eyebrow' => Translatable::normalize($page->eyebrow),
            'title' => Translatable::normalize($page->title),
            'intro' => Translatable::normalize($page->intro),
            'sections' => self::normalizeSectionsForAdmin($page->sections),
        ];
    }

    /**
     * @return array<string, list<array{title: string, body: string, link_href: string, link_label: string}>>
     */
    private static function normalizeSectionsForAdmin(mixed $sections): array
    {
        $map = Translatable::normalizeJsonListStorage(is_array($sections) ? $sections : []);

        foreach ($map as $locale => $items) {
            $map[$locale] = collect($items)
                ->map(function (mixed $item): array {
                    $data = is_array($item) ? $item : [];

                    return [
                        'title' => trim((string) ($data['title'] ?? '')),
                        'body' => trim((string) ($data['body'] ?? '')),
                        'link_href' => trim((string) ($data['link_href'] ?? '')),
                        'link_label' => trim((string) ($data['link_label'] ?? '')),
                    ];
                })
                ->values()
                ->all();
        }

        return $map;
    }

    /**
     * @param  array<string, mixed>  $sections
     * @return array<string, list<array{title: string, body: string, link_href: string, link_label: string}>>
     */
    private static function sanitizeSections(array $sections): array
    {
        $normalized = Translatable::normalizeJsonListStorage($sections);

        foreach ($normalized as $locale => $items) {
            $normalized[$locale] = collect($items)
                ->map(function (mixed $item): ?array {
                    $data = is_array($item) ? $item : [];
                    $title = trim((string) ($data['title'] ?? ''));
                    $body = trim((string) ($data['body'] ?? ''));
                    $linkHref = trim((string) ($data['link_href'] ?? ''));
                    $linkLabel = trim((string) ($data['link_label'] ?? ''));

                    if ($title === '' && $body === '') {
                        return null;
                    }

                    return [
                        'title' => $title,
                        'body' => $body,
                        'link_href' => $linkHref,
                        'link_label' => $linkLabel,
                    ];
                })
                ->filter()
                ->values()
                ->all();
        }

        return $normalized;
    }
}
