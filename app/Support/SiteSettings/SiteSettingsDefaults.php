<?php

namespace App\Support\SiteSettings;

use App\Support\Translatable;

final class SiteSettingsDefaults
{
    public const BRAND_NAME = 'Journey to Peace Afghanistan Tours';

    public const CONTACT_EMAIL = 'info@journey-to-afghanistan.com';

    public const WHATSAPP_DISPLAY = '+49 177 6687088';

    public const WHATSAPP_HREF = 'https://wa.me/491776687088';

    public const OFFICE_LOCATION = 'Shahr-e Naw, Kabul, Afghanistan';

    public const OFFICE_MAPS_HREF =
        'https://www.google.com/maps/search/?api=1&query=Shahr-e+Naw,+Kabul,+Afghanistan';

    public const OFFICE_MAPS_EMBED_SRC =
        'https://www.google.com/maps?q=Shahr-e+Naw,+Kabul,+Afghanistan&hl=en&z=15&output=embed';

    public const LOGO_COLOR = '/brand/logo-color-h.png';

    public const LOGO_WHITE = '/brand/logo-white-h.png';

    /**
     * @return list<array{label: string, href: string}>
     */
    public static function socialLinks(): array
    {
        return [
            [
                'label' => 'Instagram',
                'href' => 'https://instagram.com/journeytopeaceafghanistan',
            ],
            [
                'label' => 'Facebook',
                'href' => 'https://facebook.com/journeytopeaceafghanistan',
            ],
            [
                'label' => 'YouTube',
                'href' => 'https://youtube.com/@journeytopeaceafghanistan',
            ],
            [
                'label' => 'LinkedIn',
                'href' => 'https://linkedin.com/company/journey-to-peace-afghanistan-tours',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function attributes(): array
    {
        return [
            'brand_name' => Translatable::normalize(self::BRAND_NAME),
            'contact_email' => self::CONTACT_EMAIL,
            'whatsapp_display' => Translatable::normalize(self::WHATSAPP_DISPLAY),
            'whatsapp_href' => self::WHATSAPP_HREF,
            'office_location' => Translatable::normalize(self::OFFICE_LOCATION),
            'office_maps_href' => self::OFFICE_MAPS_HREF,
            'office_maps_embed_src' => self::OFFICE_MAPS_EMBED_SRC,
            'social_links' => self::socialLinks(),
            'logo_color_media' => null,
            'logo_white_media' => null,
        ];
    }
}
