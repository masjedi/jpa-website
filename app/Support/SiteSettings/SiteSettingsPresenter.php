<?php

namespace App\Support\SiteSettings;

use App\Models\SiteSetting;
use App\Support\Media\BrandLogoImage;
use App\Support\Media\MediaAsset;
use Throwable;

class SiteSettingsPresenter
{
    /**
     * @return array{settings: array<string, mixed>, logoSpec: array<string, mixed>}
     */
    public static function forAdmin(): array
    {
        $settings = SiteSetting::current();

        return [
            'settings' => self::adminPayload($settings),
            'logoSpec' => self::logoSpec(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function forShared(): array
    {
        try {
            return self::publicPayload(SiteSetting::current());
        } catch (Throwable) {
            return self::fallbackPublicPayload();
        }
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(SiteSetting $settings): array
    {
        $public = self::publicPayload($settings);

        return [
            ...$public,
            'logoColorMedia' => is_array($settings->logo_color_media) ? $settings->logo_color_media : null,
            'logoWhiteMedia' => is_array($settings->logo_white_media) ? $settings->logo_white_media : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(SiteSetting $settings): array
    {
        return [
            'brandName' => (string) $settings->brand_name,
            'contactEmail' => (string) $settings->contact_email,
            'contactEmailHref' => 'mailto:'.(string) $settings->contact_email,
            'whatsappDisplay' => (string) $settings->whatsapp_display,
            'whatsappHref' => (string) $settings->whatsapp_href,
            'officeLocation' => (string) $settings->office_location,
            'officeMapsHref' => (string) ($settings->office_maps_href ?: SiteSettingsDefaults::OFFICE_MAPS_HREF),
            'officeMapsEmbedSrc' => (string) ($settings->office_maps_embed_src ?: SiteSettingsDefaults::OFFICE_MAPS_EMBED_SRC),
            'socialLinks' => collect(is_array($settings->social_links) ? $settings->social_links : [])
                ->map(fn (mixed $link): array => [
                    'label' => (string) data_get($link, 'label', ''),
                    'href' => (string) data_get($link, 'href', ''),
                ])
                ->filter(fn (array $link): bool => $link['label'] !== '' && $link['href'] !== '')
                ->values()
                ->all(),
            'logoColor' => self::logoUrl($settings->logoColorAsset(), SiteSettingsDefaults::LOGO_COLOR),
            'logoWhite' => self::logoUrl($settings->logoWhiteAsset(), SiteSettingsDefaults::LOGO_WHITE),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function attributesFromValidated(array $validated): array
    {
        $socialLinks = collect($validated['social_links'] ?? [])
            ->map(fn (array $link): array => [
                'label' => trim((string) ($link['label'] ?? '')),
                'href' => trim((string) ($link['href'] ?? '')),
            ])
            ->filter(fn (array $link): bool => $link['label'] !== '' && $link['href'] !== '')
            ->values()
            ->all();

        return [
            'brand_name' => trim((string) $validated['brand_name']),
            'contact_email' => trim((string) $validated['contact_email']),
            'whatsapp_display' => trim((string) $validated['whatsapp_display']),
            'whatsapp_href' => trim((string) $validated['whatsapp_href']),
            'office_location' => trim((string) $validated['office_location']),
            'office_maps_href' => filled($validated['office_maps_href'] ?? null)
                ? trim((string) $validated['office_maps_href'])
                : null,
            'office_maps_embed_src' => filled($validated['office_maps_embed_src'] ?? null)
                ? trim((string) $validated['office_maps_embed_src'])
                : null,
            'social_links' => $socialLinks,
        ];
    }

    /**
     * @return array{width: int, height: int, aspect_ratio: string|null, max_upload_kilobytes: int, hint: string}
     */
    private static function logoSpec(): array
    {
        try {
            return BrandLogoImage::spec();
        } catch (Throwable) {
            return [
                'width' => 640,
                'height' => 160,
                'aspect_ratio' => null,
                'max_upload_kilobytes' => 4096,
                'hint' => 'PNG, JPG or WebP. Max 4096 KB.',
            ];
        }
    }

    /**
     * @return array<string, mixed>
     */
    private static function fallbackPublicPayload(): array
    {
        return [
            'brandName' => SiteSettingsDefaults::BRAND_NAME,
            'contactEmail' => SiteSettingsDefaults::CONTACT_EMAIL,
            'contactEmailHref' => 'mailto:'.SiteSettingsDefaults::CONTACT_EMAIL,
            'whatsappDisplay' => SiteSettingsDefaults::WHATSAPP_DISPLAY,
            'whatsappHref' => SiteSettingsDefaults::WHATSAPP_HREF,
            'officeLocation' => SiteSettingsDefaults::OFFICE_LOCATION,
            'officeMapsHref' => SiteSettingsDefaults::OFFICE_MAPS_HREF,
            'officeMapsEmbedSrc' => SiteSettingsDefaults::OFFICE_MAPS_EMBED_SRC,
            'socialLinks' => SiteSettingsDefaults::socialLinks(),
            'logoColor' => SiteSettingsDefaults::LOGO_COLOR,
            'logoWhite' => SiteSettingsDefaults::LOGO_WHITE,
        ];
    }

    private static function logoUrl(?MediaAsset $asset, string $fallback): string
    {
        return $asset?->detailUrl() ?? $asset?->cardUrl() ?? $fallback;
    }
}
