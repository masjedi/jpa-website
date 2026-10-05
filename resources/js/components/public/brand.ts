export interface SocialLink {
    label: string;
    href: string;
}

export interface SiteSettings {
    brandName: string;
    contactEmail: string;
    contactEmailHref: string;
    whatsappDisplay: string;
    whatsappHref: string;
    officeLocation: string;
    officeMapsHref: string;
    officeMapsEmbedSrc: string;
    socialLinks: SocialLink[];
    logoColor: string;
    logoWhite: string;
}

/** Fallback defaults used before shared props hydrate or when offline. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    brandName: 'Journey to Peace Afghanistan Tours',
    contactEmail: 'info@journey-to-afghanistan.com',
    contactEmailHref: 'mailto:info@journey-to-afghanistan.com',
    whatsappDisplay: '+49 177 6687088',
    whatsappHref: 'https://wa.me/491776687088',
    officeLocation: 'Shahr-e Naw, Kabul, Afghanistan',
    officeMapsHref:
        'https://www.google.com/maps/search/?api=1&query=Shahr-e+Naw,+Kabul,+Afghanistan',
    officeMapsEmbedSrc:
        'https://www.google.com/maps?q=Shahr-e+Naw,+Kabul,+Afghanistan&hl=en&z=15&output=embed',
    socialLinks: [
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
    ],
    logoColor: '/brand/logo-color-h.png',
    logoWhite: '/brand/logo-white-h.png',
};

/** @deprecated Prefer useSiteSettings(). Kept as fallbacks for non-hook contexts. */
export const BRAND_NAME = DEFAULT_SITE_SETTINGS.brandName;
export const CONTACT_EMAIL = DEFAULT_SITE_SETTINGS.contactEmail;
export const CONTACT_EMAIL_HREF = DEFAULT_SITE_SETTINGS.contactEmailHref;
export const WHATSAPP_DISPLAY = DEFAULT_SITE_SETTINGS.whatsappDisplay;
export const WHATSAPP_HREF = DEFAULT_SITE_SETTINGS.whatsappHref;
export const OFFICE_LOCATION = DEFAULT_SITE_SETTINGS.officeLocation;
export const OFFICE_MAPS_HREF = DEFAULT_SITE_SETTINGS.officeMapsHref;
export const OFFICE_MAPS_EMBED_SRC = DEFAULT_SITE_SETTINGS.officeMapsEmbedSrc;
export const SOCIAL_LINKS = DEFAULT_SITE_SETTINGS.socialLinks;
export const BRAND_LOGO = {
    white: DEFAULT_SITE_SETTINGS.logoWhite,
    color: DEFAULT_SITE_SETTINGS.logoColor,
} as const;

export function resolveSiteSettings(partial?: Partial<SiteSettings> | null): SiteSettings {
    if (!partial) {
        return DEFAULT_SITE_SETTINGS;
    }

    return {
        brandName: partial.brandName?.trim() || DEFAULT_SITE_SETTINGS.brandName,
        contactEmail: partial.contactEmail?.trim() || DEFAULT_SITE_SETTINGS.contactEmail,
        contactEmailHref:
            partial.contactEmailHref?.trim() ||
            `mailto:${partial.contactEmail?.trim() || DEFAULT_SITE_SETTINGS.contactEmail}`,
        whatsappDisplay: partial.whatsappDisplay?.trim() || DEFAULT_SITE_SETTINGS.whatsappDisplay,
        whatsappHref: partial.whatsappHref?.trim() || DEFAULT_SITE_SETTINGS.whatsappHref,
        officeLocation: partial.officeLocation?.trim() || DEFAULT_SITE_SETTINGS.officeLocation,
        officeMapsHref: partial.officeMapsHref?.trim() || DEFAULT_SITE_SETTINGS.officeMapsHref,
        officeMapsEmbedSrc:
            partial.officeMapsEmbedSrc?.trim() || DEFAULT_SITE_SETTINGS.officeMapsEmbedSrc,
        socialLinks:
            partial.socialLinks && partial.socialLinks.length > 0
                ? partial.socialLinks
                : DEFAULT_SITE_SETTINGS.socialLinks,
        logoColor: partial.logoColor?.trim() || DEFAULT_SITE_SETTINGS.logoColor,
        logoWhite: partial.logoWhite?.trim() || DEFAULT_SITE_SETTINGS.logoWhite,
    };
}
