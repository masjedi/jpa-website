import type { SiteSettings, SocialLink } from '@/components/public/brand';

export interface LogoSpec {
    width: number;
    height: number;
    aspect_ratio: string | null;
    max_upload_kilobytes: number;
    hint: string;
}

export interface SettingsFormValues {
    brandName: string;
    contactEmail: string;
    whatsappDisplay: string;
    whatsappHref: string;
    officeLocation: string;
    officeMapsHref: string;
    officeMapsEmbedSrc: string;
    socialLinks: SocialLink[];
}

export type SettingsFormErrors = Partial<
    Record<
        | 'brandName'
        | 'contactEmail'
        | 'whatsappDisplay'
        | 'whatsappHref'
        | 'officeLocation'
        | 'officeMapsHref'
        | 'officeMapsEmbedSrc'
        | 'socialLinks'
        | 'logoColor'
        | 'logoWhite'
        | string,
        string
    >
>;

export interface SettingsSubmitPayload {
    values: SettingsFormValues;
    logoColorFile: File | null;
    logoWhiteFile: File | null;
}

export const SETTINGS_SOCIAL_LABELS = [
    'Instagram',
    'Facebook',
    'YouTube',
    'LinkedIn',
] as const;

export function normalizeSocialLinks(links: SocialLink[]): SocialLink[] {
    const stored = new Map(links.map((link) => [link.label, link.href]));

    return SETTINGS_SOCIAL_LABELS.map((label) => ({
        label,
        href: stored.get(label) ?? '',
    }));
}

export function settingsToFormValues(settings: SiteSettings): SettingsFormValues {
    return {
        brandName: settings.brandName,
        contactEmail: settings.contactEmail,
        whatsappDisplay: settings.whatsappDisplay,
        whatsappHref: settings.whatsappHref,
        officeLocation: settings.officeLocation,
        officeMapsHref: settings.officeMapsHref,
        officeMapsEmbedSrc: settings.officeMapsEmbedSrc,
        socialLinks: normalizeSocialLinks(settings.socialLinks),
    };
}

export function buildSettingsFormData(payload: SettingsSubmitPayload): FormData {
    const { values, logoColorFile, logoWhiteFile } = payload;
    const formData = new FormData();

    formData.append('_method', 'patch');
    formData.append('brand_name', values.brandName.trim());
    formData.append('contact_email', values.contactEmail.trim());
    formData.append('whatsapp_display', values.whatsappDisplay.trim());
    formData.append('whatsapp_href', values.whatsappHref.trim());
    formData.append('office_location', values.officeLocation.trim());
    formData.append('office_maps_href', values.officeMapsHref.trim());
    formData.append('office_maps_embed_src', values.officeMapsEmbedSrc.trim());

    normalizeSocialLinks(values.socialLinks).forEach((link, index) => {
        formData.append(`social_links[${index}][label]`, link.label.trim());
        formData.append(`social_links[${index}][href]`, link.href.trim());
    });

    if (logoColorFile) {
        formData.append('logo_color', logoColorFile);
    }

    if (logoWhiteFile) {
        formData.append('logo_white', logoWhiteFile);
    }

    return formData;
}

export function mapSettingsServerErrors(errors: Record<string, string>): SettingsFormErrors {
    const mapped: SettingsFormErrors = {};

    Object.entries(errors).forEach(([key, message]) => {
        const camel = key
            .replace(/\.(\d+)\./g, '.$1.')
            .replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
            .replace(/\./g, '_');

        mapped[camel] = message;
        mapped[key] = message;
    });

    return mapped;
}

export function countConfiguredSocialLinks(links: SocialLink[]): number {
    return links.filter((link) => link.href.trim() !== '').length;
}
