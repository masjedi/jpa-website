import type {
    ServiceCategory,
    ServiceIconOption,
    ServiceOffering,
    ServiceOfferingStatus,
} from '@/types/services';
import type { TranslatedString } from '@/types/locale';
import {
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired, type AdminJsonPayload } from '@/lib/translatableForm';

export interface ServiceFormValues {
    title: TranslatedString;
    slug: string;
    tagline: TranslatedString;
    description: TranslatedString;
    category: ServiceCategory;
    iconKey: string;
    featuresText: TranslatedString;
    isFeatured: boolean;
    showOnHome: boolean;
    status: ServiceOfferingStatus;
}

export function createEmptyServiceFormValues(
    iconOptions: readonly ServiceIconOption[],
    categoryOptions: readonly ServiceCategory[],
): ServiceFormValues {
    return {
        title: createEmptyTranslatedString(),
        slug: '',
        tagline: createEmptyTranslatedString(),
        description: createEmptyTranslatedString(),
        category: categoryOptions[0] ?? 'Journey',
        iconKey: iconOptions[0]?.value ?? 'users',
        featuresText: createEmptyTranslatedString(),
        isFeatured: false,
        showOnHome: false,
        status: 'Draft',
    };
}

export function serviceToFormValues(offering: ServiceOffering): ServiceFormValues {
    return {
        title: normalizeTranslatedString(offering.title),
        slug: offering.slug,
        tagline: normalizeTranslatedString(offering.tagline),
        description: normalizeTranslatedString(offering.description),
        category: offering.category,
        iconKey: offering.iconKey,
        featuresText: normalizeTranslatedString(offering.featuresText),
        isFeatured: offering.isFeatured,
        showOnHome: offering.showOnHome,
        status: offering.status,
    };
}

export type ServiceFormField = 'title' | 'tagline' | 'description' | 'featuresText';

export type ServiceFormErrors = Partial<Record<ServiceFormField, string>>;

const serverFieldMap = buildTranslatableFieldMap('', ['title', 'tagline', 'description', 'features_text']);

export function mapServerServiceFormErrors(
    errors: Record<string, string | string[] | undefined>,
): ServiceFormErrors {
    const mapped = mapTranslatableServerErrors(errors, serverFieldMap);

    if (errors.features_text && !mapped.featuresText) {
        mapped.featuresText = Array.isArray(errors.features_text)
            ? errors.features_text[0]
            : errors.features_text;
    }

    return mapped;
}

export function validateServiceFormValues(values: ServiceFormValues): ServiceFormErrors {
    const errors: ServiceFormErrors = {};

    const titleError = validateEnglishRequired(values.title, 'Title');
    if (titleError) {
        errors.title = titleError;
    }

    const taglineError = validateEnglishRequired(values.tagline, 'Tagline');
    if (taglineError) {
        errors.tagline = taglineError;
    }

    const descriptionError = validateEnglishRequired(values.description, 'Description');
    if (descriptionError) {
        errors.description = descriptionError;
    }

    if (!values.featuresText.en.trim()) {
        errors.featuresText = 'English features are required';
    }

    return errors;
}

export function buildServicePayload(values: ServiceFormValues): AdminJsonPayload {
    return {
        title: values.title,
        slug: values.slug.trim(),
        tagline: values.tagline,
        description: values.description,
        category: values.category,
        icon_key: values.iconKey,
        features_text: values.featuresText,
        is_featured: values.isFeatured ? '1' : '0',
        show_on_home: values.showOnHome ? '1' : '0',
        status: values.status,
    };
}
