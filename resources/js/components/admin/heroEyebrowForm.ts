export interface HeroEyebrowFormValues {
    eyebrow: string;
}

export function createHeroEyebrowFormValues(eyebrow: string): HeroEyebrowFormValues {
    return { eyebrow };
}

export type HeroEyebrowFormField = 'eyebrow';

export type HeroEyebrowFormErrors = Partial<Record<HeroEyebrowFormField, string>>;

export function validateHeroEyebrowFormValues(
    values: HeroEyebrowFormValues,
): HeroEyebrowFormErrors {
    const errors: HeroEyebrowFormErrors = {};

    if (!values.eyebrow.trim()) {
        errors.eyebrow = 'Required';
    }

    return errors;
}
