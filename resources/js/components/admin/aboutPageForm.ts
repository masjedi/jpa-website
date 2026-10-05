import type { AdminAboutPageContent } from '@/types/aboutPage';
import type { TranslatedString } from '@/types/locale';
import {
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, validateEnglishRequired, type AdminJsonPayload } from '@/lib/translatableForm';

export type AboutContentFormValues = {
    introEyebrow: TranslatedString;
    introTitle: TranslatedString;
    introDescription: TranslatedString;
    missionSectionEyebrow: TranslatedString;
    missionSectionTitle: TranslatedString;
    missionTitle: TranslatedString;
    missionDescription: TranslatedString;
    visionTitle: TranslatedString;
    visionDescription: TranslatedString;
    ctaEyebrow: TranslatedString;
    ctaTitle: TranslatedString;
    ctaDescription: TranslatedString;
    ctaPrimaryLabel: TranslatedString;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: TranslatedString;
    ctaSecondaryHref: string;
};

export const aboutContentTranslatableFields = [
    'introEyebrow',
    'introTitle',
    'introDescription',
    'missionSectionEyebrow',
    'missionSectionTitle',
    'missionTitle',
    'missionDescription',
    'visionTitle',
    'visionDescription',
    'ctaEyebrow',
    'ctaTitle',
    'ctaDescription',
    'ctaPrimaryLabel',
    'ctaSecondaryLabel',
] as const;

export type AboutContentTranslatableField = (typeof aboutContentTranslatableFields)[number];

export function createEmptyAboutContentFormValues(): AboutContentFormValues {
    return {
        introEyebrow: createEmptyTranslatedString(),
        introTitle: createEmptyTranslatedString(),
        introDescription: createEmptyTranslatedString(),
        missionSectionEyebrow: createEmptyTranslatedString(),
        missionSectionTitle: createEmptyTranslatedString(),
        missionTitle: createEmptyTranslatedString(),
        missionDescription: createEmptyTranslatedString(),
        visionTitle: createEmptyTranslatedString(),
        visionDescription: createEmptyTranslatedString(),
        ctaEyebrow: createEmptyTranslatedString(),
        ctaTitle: createEmptyTranslatedString(),
        ctaDescription: createEmptyTranslatedString(),
        ctaPrimaryLabel: createEmptyTranslatedString(),
        ctaPrimaryHref: '',
        ctaSecondaryLabel: createEmptyTranslatedString(),
        ctaSecondaryHref: '',
    };
}

export function aboutContentToFormValues(content: AdminAboutPageContent): AboutContentFormValues {
    return {
        introEyebrow: normalizeTranslatedString(content.intro.eyebrow),
        introTitle: normalizeTranslatedString(content.intro.title),
        introDescription: normalizeTranslatedString(content.intro.description),
        missionSectionEyebrow: normalizeTranslatedString(content.missionSection.eyebrow),
        missionSectionTitle: normalizeTranslatedString(content.missionSection.title),
        missionTitle: normalizeTranslatedString(content.missionVision.mission.title),
        missionDescription: normalizeTranslatedString(content.missionVision.mission.description),
        visionTitle: normalizeTranslatedString(content.missionVision.vision.title),
        visionDescription: normalizeTranslatedString(content.missionVision.vision.description),
        ctaEyebrow: normalizeTranslatedString(content.cta.eyebrow),
        ctaTitle: normalizeTranslatedString(content.cta.title),
        ctaDescription: normalizeTranslatedString(content.cta.description),
        ctaPrimaryLabel: normalizeTranslatedString(content.cta.primaryLabel),
        ctaPrimaryHref: content.cta.primaryHref,
        ctaSecondaryLabel: normalizeTranslatedString(content.cta.secondaryLabel),
        ctaSecondaryHref: content.cta.secondaryHref,
    };
}

export function buildAboutContentPayload(values: AboutContentFormValues): AdminJsonPayload {
    return {
        intro_eyebrow: values.introEyebrow,
        intro_title: values.introTitle,
        intro_description: values.introDescription,
        mission_section_eyebrow: values.missionSectionEyebrow,
        mission_section_title: values.missionSectionTitle,
        mission_title: values.missionTitle,
        mission_description: values.missionDescription,
        vision_title: values.visionTitle,
        vision_description: values.visionDescription,
        cta_eyebrow: values.ctaEyebrow,
        cta_title: values.ctaTitle,
        cta_description: values.ctaDescription,
        cta_primary_label: values.ctaPrimaryLabel,
        cta_primary_href: values.ctaPrimaryHref.trim(),
        cta_secondary_label: values.ctaSecondaryLabel,
        cta_secondary_href: values.ctaSecondaryHref.trim(),
    };
}

export type AboutContentFormErrors = Partial<Record<AboutContentTranslatableField, string>>;

const requiredEnglishFields: readonly { field: AboutContentTranslatableField; label: string }[] = [
    { field: 'introTitle', label: 'Intro title' },
    { field: 'introDescription', label: 'Intro description' },
    { field: 'missionSectionTitle', label: 'Mission section title' },
    { field: 'missionTitle', label: 'Mission title' },
    { field: 'missionDescription', label: 'Mission description' },
    { field: 'visionTitle', label: 'Vision title' },
    { field: 'visionDescription', label: 'Vision description' },
    { field: 'ctaTitle', label: 'CTA title' },
    { field: 'ctaDescription', label: 'CTA description' },
    { field: 'ctaPrimaryLabel', label: 'CTA primary label' },
    { field: 'ctaSecondaryLabel', label: 'CTA secondary label' },
];

export function validateAboutContentFormValues(values: AboutContentFormValues): AboutContentFormErrors {
    const errors: AboutContentFormErrors = {};

    for (const { field, label } of requiredEnglishFields) {
        const error = validateEnglishRequired(values[field], label);
        if (error) {
            errors[field] = error;
        }
    }

    return errors;
}

export const aboutContentServerFieldMap = buildTranslatableFieldMap('', [
    'intro_eyebrow',
    'intro_title',
    'intro_description',
    'mission_section_eyebrow',
    'mission_section_title',
    'mission_title',
    'mission_description',
    'vision_title',
    'vision_description',
    'cta_eyebrow',
    'cta_title',
    'cta_description',
    'cta_primary_label',
    'cta_secondary_label',
]);
