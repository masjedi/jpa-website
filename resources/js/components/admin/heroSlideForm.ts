import type { HeroSlide, HeroSlideStatus } from '@/types/heroSection';

export interface HeroSlideFormValues {
    title: string;
    subtitle: string;
    status: HeroSlideStatus;
}

export function createEmptyHeroSlideFormValues(): HeroSlideFormValues {
    return {
        title: '',
        subtitle: '',
        status: 'Published',
    };
}

export function heroSlideToFormValues(
    slide: HeroSlide,
    status: HeroSlideStatus = slide.status,
): HeroSlideFormValues {
    return {
        title: slide.title,
        subtitle: slide.subtitle,
        status,
    };
}

export type HeroSlideFormField = 'title' | 'subtitle';

export type HeroSlideFormErrors = Partial<Record<HeroSlideFormField, string>>;

export function validateHeroSlideFormValues(values: HeroSlideFormValues): HeroSlideFormErrors {
    const errors: HeroSlideFormErrors = {};

    if (!values.title.trim()) {
        errors.title = 'Required';
    }

    if (!values.subtitle.trim()) {
        errors.subtitle = 'Required';
    }

    return errors;
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
