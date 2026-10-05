import type { HeroSlide, HeroSlideStatus } from '@/types/heroSection';
import { LOCALE_CODES, type TranslatedString } from '@/types/locale';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';

export interface HeroSlideFormValues {
    title: TranslatedString;
    subtitle: TranslatedString;
    status: HeroSlideStatus;
    existingImageUrl: string | null;
}

export function createEmptyHeroSlideFormValues(): HeroSlideFormValues {
    return {
        title: createEmptyTranslatedString(),
        subtitle: createEmptyTranslatedString(),
        status: 'Published',
        existingImageUrl: null,
    };
}

export function heroSlideToFormValues(
    slide: HeroSlide,
    status: HeroSlideStatus = slide.status,
): HeroSlideFormValues {
    return {
        title: normalizeTranslatedString(slide.title),
        subtitle: normalizeTranslatedString(slide.subtitle),
        status,
        existingImageUrl: slide.imageThumbUrl,
    };
}

export type HeroSlideFormField = 'title' | 'subtitle' | 'image';

export type HeroSlideFormErrors = Partial<Record<HeroSlideFormField, string>>;

export interface HeroSlideSubmitPayload {
    values: HeroSlideFormValues;
    heroImage: File | null;
}

const serverFieldMap: Record<string, HeroSlideFormField> = {
    title: 'title',
    subtitle: 'subtitle',
    hero_image: 'image',
    ...Object.fromEntries(LOCALE_CODES.flatMap((locale) => [
        [`title.${locale}`, 'title' as const],
        [`subtitle.${locale}`, 'subtitle' as const],
    ])),
};

export function mapServerHeroSlideFormErrors(
    errors: Record<string, string | string[] | undefined>,
): HeroSlideFormErrors {
    const mapped: HeroSlideFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = serverFieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function validateHeroSlideFormValues(
    values: HeroSlideFormValues,
    hasImage: boolean,
): HeroSlideFormErrors {
    const errors: HeroSlideFormErrors = {};

    if (!values.title.en.trim()) {
        errors.title = 'English title is required';
    }

    if (!values.subtitle.en.trim()) {
        errors.subtitle = 'English subtitle is required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    return errors;
}

export function buildHeroSlideFormData({
    values,
    heroImage,
}: HeroSlideSubmitPayload): FormData {
    const formData = new FormData();

    appendTranslatedStringToFormData(formData, 'title', values.title);
    appendTranslatedStringToFormData(formData, 'subtitle', values.subtitle);
    formData.append('status', values.status);

    if (heroImage) {
        formData.append('hero_image', heroImage);
    }

    return formData;
}

export function formatHeroUpdatedLabel(): string {
    return 'Just now';
}

export function nextHeroSlideId(slides: readonly HeroSlide[]): number {
    return slides.reduce((maxId, slide) => Math.max(maxId, slide.id), 0) + 1;
}

export function nextHeroSlideOrder(slides: readonly HeroSlide[]): number {
    return slides.reduce((maxOrder, slide) => Math.max(maxOrder, slide.order), 0) + 1;
}
