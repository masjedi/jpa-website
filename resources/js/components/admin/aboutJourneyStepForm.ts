import type { AboutIconOption, AboutJourneyStep, AboutJourneyStepStatus } from '@/types/aboutPage';

export interface AboutJourneyStepFormValues {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    iconKey: string;
    status: AboutJourneyStepStatus;
}

export function createEmptyAboutJourneyStepFormValues(
    iconOptions: readonly AboutIconOption[],
): AboutJourneyStepFormValues {
    return {
        title: '',
        description: '',
        image: '',
        imageAlt: '',
        iconKey: iconOptions[0]?.value ?? 'compass',
        status: 'Draft',
    };
}

export function aboutJourneyStepToFormValues(step: AboutJourneyStep): AboutJourneyStepFormValues {
    return {
        title: step.title,
        description: step.description,
        image: step.image,
        imageAlt: step.imageAlt,
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

export function validateAboutJourneyStepFormValues(
    values: AboutJourneyStepFormValues,
    hasImage: boolean,
): AboutJourneyStepFormErrors {
    const errors: AboutJourneyStepFormErrors = {};

    if (!values.title.trim()) {
        errors.title = 'Required';
    }

    if (!values.description.trim()) {
        errors.description = 'Required';
    }

    if (!values.imageAlt.trim()) {
        errors.imageAlt = 'Required';
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

    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('image_alt', values.imageAlt);
    formData.append('icon_key', values.iconKey);
    formData.append('status', values.status);

    if (imageFile) {
        formData.append('image', imageFile);
    }

    return formData;
}
