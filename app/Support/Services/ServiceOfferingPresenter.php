<?php

namespace App\Support\Services;

use App\Enums\ServiceOfferingCategory;
use App\Models\ServiceOffering;
use App\Support\Translatable;

class ServiceOfferingPresenter
{
    /**
     * @return array{
     *     items: list<array<string, mixed>>,
     *     iconOptions: list<array{value: string, label: string}>,
     *     categoryOptions: list<string>
     * }
     */
    public static function forAdminIndex(): array
    {
        return [
            'items' => ServiceOffering::query()
                ->ordered()
                ->get()
                ->map(fn (ServiceOffering $offering): array => self::adminPayload($offering))
                ->values()
                ->all(),
            'iconOptions' => self::iconOptions(),
            'categoryOptions' => ServiceOfferingCategory::frontendValues(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicPage(): array
    {
        return ServiceOffering::query()
            ->published()
            ->ordered()
            ->get()
            ->map(fn (ServiceOffering $offering): array => self::publicPayload($offering))
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(): array
    {
        return ServiceOffering::query()
            ->published()
            ->onHome()
            ->ordered()
            ->get()
            ->map(fn (ServiceOffering $offering): array => self::homePayload($offering))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(ServiceOffering $offering): array
    {
        return [
            'id' => $offering->id,
            'title' => Translatable::normalize($offering->title),
            'slug' => (string) $offering->slug,
            'tagline' => Translatable::normalize($offering->tagline),
            'description' => Translatable::normalize($offering->description),
            'category' => $offering->category->frontendLabel(),
            'iconKey' => (string) $offering->icon_key,
            'featuresText' => Translatable::stringListToTextMap($offering->features ?? []),
            'features' => Translatable::resolveStringList($offering->features ?? []),
            'isFeatured' => (bool) $offering->is_featured,
            'showOnHome' => (bool) $offering->show_on_home,
            'order' => (int) $offering->sort_order,
            'status' => $offering->status->frontendLabel(),
            'updated' => $offering->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(ServiceOffering $offering): array
    {
        return [
            'id' => $offering->id,
            'slug' => (string) $offering->slug,
            'title' => Translatable::resolve($offering->title),
            'tagline' => Translatable::resolve($offering->tagline),
            'description' => Translatable::resolve($offering->description),
            'category' => $offering->category->frontendLabel(),
            'iconKey' => (string) $offering->icon_key,
            'features' => Translatable::resolveStringList($offering->features ?? []),
            'isFeatured' => (bool) $offering->is_featured,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function homePayload(ServiceOffering $offering): array
    {
        return [
            'id' => $offering->id,
            'slug' => (string) $offering->slug,
            'title' => Translatable::resolve($offering->title),
            'description' => Translatable::resolve($offering->tagline),
            'iconKey' => (string) $offering->icon_key,
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function iconOptions(): array
    {
        return collect(ServiceOfferingIcons::keys())
            ->map(fn (string $key): array => [
                'value' => $key,
                'label' => ucwords(str_replace('-', ' ', $key)),
            ])
            ->all();
    }
}
