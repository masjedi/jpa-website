import type { AboutIconOption, AboutJourneyStep, AboutJourneyStepStatus } from '@/types/aboutPage';
import type { TranslatedString } from '@/types/locale';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired } from '@/lib/translatableForm';

export interface AboutJourneyStepFormValues {
    title: TranslatedString;
    description: TranslatedString;
    image: string;
    imageAlt: TranslatedString;
    iconKey: string;
    status: AboutJourneyStepStatus;
}

export function createEmptyAboutJourneyStepFormValues(
    iconOptions: readonly AboutIconOption[],
): AboutJourneyStepFormValues {
    return {
        title: createEmptyTranslatedString(),
        description: createEmptyTranslatedString(),
        image: '',
        imageAlt: createEmptyTranslatedString(),
        iconKey: iconOptions[0]?.value ?? 'compass',
        status: 'Draft',
    };
}

export function aboutJourneyStepToFormValues(step: AboutJourneyStep): AboutJourneyStepFormValues {
    return {
        title: normalizeTranslatedString(step.title),
        description: normalizeTranslatedString(step.description),
        image: step.image,
        imageAlt: normalizeTranslatedString(step.imageAlt),
        iconKey: step.iconKey,
        status: step.status,
    };
}

export type AboutJourneyStepFormField =
    | 'title'
    | 'description'
    | 'image'
    | 'imageAlt'
    | 'iconKey';

export type AboutJourneyStepFormErrors = Partial<Record<AboutJourneyStepFormField, string>>;

const serverFieldMap = buildTranslatableFieldMap('', ['title', 'description', 'image_alt']);

export function mapServerAboutJourneyStepFormErrors(
    errors: Record<string, string | string[] | undefined>,
): AboutJourneyStepFormErrors {
    const mapped = mapTranslatableServerErrors(errors, serverFieldMap);

    if (errors.image_alt && !mapped.imageAlt) {
        mapped.imageAlt = Array.isArray(errors.image_alt) ? errors.image_alt[0] : errors.image_alt;
    }

    return mapped;
}

export function validateAboutJourneyStepFormValues(
    values: AboutJourneyStepFormValues,
    hasImage: boolean,
): AboutJourneyStepFormErrors {
    const errors: AboutJourneyStepFormErrors = {};

    const titleError = validateEnglishRequired(values.title, 'Title');
    if (titleError) {
        errors.title = titleError;
    }

    const descriptionError = validateEnglishRequired(values.description, 'Description');
    if (descriptionError) {
        errors.description = descriptionError;
    }

    const imageAltError = validateEnglishRequired(values.imageAlt, 'Image alt text');
    if (imageAltError) {
        errors.imageAlt = imageAltError;
    }

    if (!values.iconKey) {
        errors.iconKey = 'Required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    return errors;
}

export interface AboutJourneyStepSubmitPayload {
    values: AboutJourneyStepFormValues;
    imageFile: File | null;
}

export function buildAboutJourneyStepFormData({
    values,
    imageFile,
}: AboutJourneyStepSubmitPayload): FormData {
    const formData = new FormData();

    appendTranslatedStringToFormData(formData, 'title', values.title);
    appendTranslatedStringToFormData(formData, 'description', values.description);
    appendTranslatedStringToFormData(formData, 'image_alt', values.imageAlt);
    formData.append('icon_key', values.iconKey);
    formData.append('status', values.status);

    if (imageFile) {
        formData.append('image', imageFile);
    }

    return formData;
}
