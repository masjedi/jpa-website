import type { TranslatedString } from '@/types/locale';

export type HeroSlideStatus = 'Published' | 'Draft';

export interface PublicHeroSlide {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string | null;
    imageMediumUrl: string | null;
    imageUltraUrl: string | null;
}

export interface HeroSlide {
    id: number;
    title: TranslatedString;
    subtitle: TranslatedString;
    status: HeroSlideStatus;
    order: number;
    updated: string;
    imageUrl: string | null;
    imageMediumUrl: string | null;
    imageUltraUrl: string | null;
    imageThumbUrl: string | null;
}

export interface PublicHeroSection {
    eyebrow: string;
    slides: readonly PublicHeroSlide[];
}

export interface AdminHeroSection {
    eyebrow: TranslatedString;
    slides: readonly HeroSlide[];
}
