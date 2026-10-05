<?php

namespace App\Support\Services;

use App\Enums\ServiceOfferingCategory;
use App\Enums\ServiceOfferingStatus;
use App\Support\Translatable;
use Illuminate\Support\Str;

class ServiceOfferingAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        $title = Translatable::sanitize($validated['title']);
        $slug = trim((string) ($validated['slug'] ?? ''));

        return [
            'status' => ServiceOfferingStatus::fromFrontend((string) $validated['status']),
            'title' => $title,
            'slug' => $slug !== '' ? Str::slug($slug) : Str::slug(Translatable::resolve($title)),
            'tagline' => Translatable::sanitize($validated['tagline']),
            'description' => Translatable::sanitize($validated['description']),
            'category' => ServiceOfferingCategory::fromFrontend((string) $validated['category']),
            'icon_key' => (string) $validated['icon_key'],
            'features' => Translatable::sanitizeStringListFromText($validated['features_text']),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'show_on_home' => (bool) ($validated['show_on_home'] ?? false),
        ];
    }
}
