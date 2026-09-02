<?php

namespace App\Support\Services;

use App\Enums\ServiceOfferingCategory;
use App\Enums\ServiceOfferingStatus;
use Illuminate\Support\Str;

class ServiceOfferingAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        $title = trim((string) $validated['title']);
        $slug = trim((string) ($validated['slug'] ?? ''));

        return [
            'status' => ServiceOfferingStatus::fromFrontend((string) $validated['status']),
            'title' => $title,
            'slug' => $slug !== '' ? Str::slug($slug) : Str::slug($title),
            'tagline' => trim((string) $validated['tagline']),
            'description' => trim((string) $validated['description']),
            'category' => ServiceOfferingCategory::fromFrontend((string) $validated['category']),
            'icon_key' => (string) $validated['icon_key'],
            'features' => ServiceOfferingText::lines((string) $validated['features_text']),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'show_on_home' => (bool) ($validated['show_on_home'] ?? false),
        ];
    }
}
