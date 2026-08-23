export type HeroSlideStatus = 'Published' | 'Draft';

export interface PublicHeroSlide {
    id: number;
    title: string;
    subtitle: string;
}

export interface HeroSlide extends PublicHeroSlide {
    status: HeroSlideStatus;
    order: number;
    updated: string;
}

export interface PublicHeroSection {
    eyebrow: string;
    slides: readonly PublicHeroSlide[];
}
