<?php

namespace App\Support\Gallery;

use App\Models\GalleryPhoto;

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
            ->map(fn (GalleryPhoto $photo): array => self::publicPayload($photo))
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
            'alt' => (string) $photo->alt,
            'caption' => (string) $photo->caption,
            'src' => self::displayUrl($photo),
            'thumbSrc' => self::thumbUrl($photo),
            'sortOrder' => (int) $photo->sort_order,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(GalleryPhoto $photo): array
    {
        return [
            'id' => (string) $photo->id,
            'src' => self::displayUrl($photo),
            'alt' => (string) $photo->alt,
            'caption' => (string) $photo->caption,
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
