import type { TranslatedString } from '@/types/locale';

export interface HeroEyebrowFormValues {
    eyebrow: TranslatedString;
}

export function createHeroEyebrowFormValues(eyebrow: TranslatedString): HeroEyebrowFormValues {
    return { eyebrow };
}

export type HeroEyebrowFormField = 'eyebrow';

export type HeroEyebrowFormErrors = Partial<Record<HeroEyebrowFormField, string>>;

export function validateHeroEyebrowFormValues(
    values: HeroEyebrowFormValues,
): HeroEyebrowFormErrors {
    const errors: HeroEyebrowFormErrors = {};

    if (!values.eyebrow.en.trim()) {
        errors.eyebrow = 'English eyebrow is required';
    }

    return errors;
}
