<?php

namespace App\Support\Gallery;

use App\Models\GalleryPhoto;
use App\Support\Translatable;

class GalleryPhotoPresenter
{
    /**
     * @return array{photos: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'photos' => GalleryPhoto::query()
                ->ordered()
                ->get()
                ->map(fn (GalleryPhoto $photo): array => self::adminPayload($photo))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{photos: list<array<string, mixed>>}
     */
    public static function forPublicIndex(): array
    {
        return [
            'photos' => GalleryPhoto::query()
                ->published()
                ->ordered()
                ->get()
                ->map(fn (GalleryPhoto $photo): array => self::publicPayload($photo))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(int $limit = 6): array
    {
        return GalleryPhoto::query()
            ->published()
            ->ordered()
            ->limit($limit)
            ->get()
            ->map(fn (GalleryPhoto $photo): array => self::publicPayload($photo, useThumb: true))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(GalleryPhoto $photo): array
    {
        return [
            'id' => $photo->id,
            'status' => $photo->status->frontendLabel(),
            'alt' => Translatable::normalize($photo->alt),
            'caption' => Translatable::normalize($photo->caption),
            'src' => self::displayUrl($photo),
            'thumbSrc' => self::thumbUrl($photo),
            'sortOrder' => (int) $photo->sort_order,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(GalleryPhoto $photo, bool $useThumb = false): array
    {
        return [
            'id' => (string) $photo->id,
            'src' => $useThumb ? self::thumbUrl($photo) : self::displayUrl($photo),
            'alt' => Translatable::resolve($photo->alt),
            'caption' => Translatable::resolve($photo->caption),
        ];
    }

    private static function displayUrl(GalleryPhoto $photo): string
    {
        return $photo->imageAsset()?->detailUrl()
            ?? $photo->imageUrl()
            ?? '';
    }

    private static function thumbUrl(GalleryPhoto $photo): string
    {
        return $photo->imageAsset()?->cardUrl()
            ?? $photo->imageUrl()
            ?? '';
    }
}
