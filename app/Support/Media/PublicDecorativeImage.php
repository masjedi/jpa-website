<?php

namespace App\Support\Media;

use App\Models\Destination;
use App\Models\GalleryPhoto;
use App\Models\Tour;
use App\Support\Gallery\GalleryPhotoPresenter;
use App\Support\SiteSettings\SiteSettingsDefaults;

/**
 * Resolves decorative public imagery from CMS media only (no external CDNs).
 */
class PublicDecorativeImage
{
    public static function resolve(?string $preferred = null): string
    {
        $preferred = is_string($preferred) ? trim($preferred) : '';

        if ($preferred !== '' && ! self::isExternalUrl($preferred)) {
            return $preferred;
        }

        $destination = Destination::query()
            ->published()
            ->whereNotNull('cover_media')
            ->featuredFirst()
            ->first();

        if ($destination !== null) {
            $url = $destination->coverImageUrl();

            if (filled($url) && ! self::isExternalUrl($url)) {
                return $url;
            }
        }

        $tour = Tour::query()
            ->published()
            ->tours()
            ->whereNotNull('cover_media')
            ->latestFirst()
            ->first();

        if ($tour !== null) {
            $url = $tour->coverImageUrl();

            if (filled($url) && ! self::isExternalUrl($url)) {
                return $url;
            }
        }

        $photo = GalleryPhoto::query()
            ->published()
            ->ordered()
            ->first();

        if ($photo !== null) {
            $payload = GalleryPhotoPresenter::publicPayload($photo);
            $url = (string) ($payload['src'] ?? '');

            if ($url !== '' && ! self::isExternalUrl($url)) {
                return $url;
            }
        }

        return SiteSettingsDefaults::LOGO_COLOR;
    }

    public static function isExternalUrl(string $value): bool
    {
        return str_starts_with($value, 'http://') || str_starts_with($value, 'https://');
    }
}
