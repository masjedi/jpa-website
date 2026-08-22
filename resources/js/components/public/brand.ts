export const BRAND_NAME = 'Journey to Peace Afghanistan Tours';

export const CONTACT_EMAIL = 'info@journey-to-afghanistan.com';
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const WHATSAPP_DISPLAY = '+49 177 6687088';
export const WHATSAPP_HREF = 'https://wa.me/491776687088';

export const OFFICE_LOCATION = 'Shahr-e Naw, Kabul, Afghanistan';
export const OFFICE_MAPS_HREF =
    'https://www.google.com/maps/search/?api=1&query=Shahr-e+Naw,+Kabul,+Afghanistan';
export const OFFICE_MAPS_EMBED_SRC =
    'https://www.google.com/maps?q=Shahr-e+Naw,+Kabul,+Afghanistan&hl=en&z=15&output=embed';

export interface SocialLink {
    label: string;
    href: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
    {
        label: 'Instagram',
        href: 'https://instagram.com/journeytopeaceafghanistan',
    },
    {
        label: 'Facebook',
        href: 'https://facebook.com/journeytopeaceafghanistan',
    },
    {
        label: 'YouTube',
        href: 'https://youtube.com/@journeytopeaceafghanistan',
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/company/journey-to-peace-afghanistan-tours',
    },
] as const;

export const BRAND_LOGO = {
    /** Horizontal white wordmark — dark backgrounds (navbar overlay, footer, admin sidebar) */
    white: '/brand/logo-white-h.png',
    /** Horizontal color wordmark — light backgrounds */
    color: '/brand/logo-color-h.png',
} as const;
