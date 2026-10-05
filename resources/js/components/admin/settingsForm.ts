import type { SocialLink } from '@/components/public/brand';
import type { TranslatedString } from '@/types/locale';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, validateEnglishRequired } from '@/lib/translatableForm';

export interface LogoSpec {
    width: number;
    height: number;
    aspect_ratio: string | null;
    max_upload_kilobytes: number;
    hint: string;
}

export interface AdminSiteSettings {
    brandName: TranslatedString;
    contactEmail: string;
    contactEmailHref: string;
    whatsappDisplay: TranslatedString;
    whatsappHref: string;
    officeLocation: TranslatedString;
    officeMapsHref: string;
    officeMapsEmbedSrc: string;
    socialLinks: SocialLink[];
    logoColor: string;
    logoWhite: string;
}

export interface SettingsFormValues {
    brandName: TranslatedString;
    contactEmail: string;
    whatsappDisplay: TranslatedString;
    whatsappHref: string;
    officeLocation: TranslatedString;
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

export function settingsToFormValues(settings: AdminSiteSettings): SettingsFormValues {
    return {
        brandName: normalizeTranslatedString(settings.brandName),
        contactEmail: settings.contactEmail,
        whatsappDisplay: normalizeTranslatedString(settings.whatsappDisplay),
        whatsappHref: settings.whatsappHref,
        officeLocation: normalizeTranslatedString(settings.officeLocation),
        officeMapsHref: settings.officeMapsHref,
        officeMapsEmbedSrc: settings.officeMapsEmbedSrc,
        socialLinks: normalizeSocialLinks(settings.socialLinks),
    };
}

export function validateSettingsFormValues(values: SettingsFormValues): SettingsFormErrors {
    const errors: SettingsFormErrors = {};

    const brandError = validateEnglishRequired(values.brandName, 'Brand name');
    if (brandError) {
        errors.brandName = brandError;
    }

    if (!values.contactEmail.trim()) {
        errors.contactEmail = 'Required';
    }

    const whatsappError = validateEnglishRequired(values.whatsappDisplay, 'WhatsApp display');
    if (whatsappError) {
        errors.whatsappDisplay = whatsappError;
    }

    if (!values.whatsappHref.trim()) {
        errors.whatsappHref = 'Required';
    }

    const officeError = validateEnglishRequired(values.officeLocation, 'Office location');
    if (officeError) {
        errors.officeLocation = officeError;
    }

    return errors;
}

export function buildSettingsFormData(payload: SettingsSubmitPayload): FormData {
    const { values, logoColorFile, logoWhiteFile } = payload;
    const formData = new FormData();

    formData.append('_method', 'patch');
    appendTranslatedStringToFormData(formData, 'brand_name', values.brandName);
    formData.append('contact_email', values.contactEmail.trim());
    appendTranslatedStringToFormData(formData, 'whatsapp_display', values.whatsappDisplay);
    formData.append('whatsapp_href', values.whatsappHref.trim());
    appendTranslatedStringToFormData(formData, 'office_location', values.officeLocation);
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
    const fieldMap = buildTranslatableFieldMap('', ['brand_name', 'whatsapp_display', 'office_location']);
    const mapped: SettingsFormErrors = {};

    Object.entries(errors).forEach(([key, message]) => {
        const camel = key
            .replace(/\.(\d+)\./g, '.$1.')
            .replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
            .replace(/\./g, '_');

        mapped[camel] = message;
        mapped[key] = message;

        const translatableField = fieldMap[key];
        if (translatableField) {
            mapped[translatableField] = message;
        }
    });

    return mapped;
}

export function countConfiguredSocialLinks(links: SocialLink[]): number {
    return links.filter((link) => link.href.trim() !== '').length;
}
