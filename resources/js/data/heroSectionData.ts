export type HeroSlideStatus = 'Published' | 'Draft';

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    status: HeroSlideStatus;
    order: number;
    updated: string;
}

export const heroSectionEyebrow = 'Premium guided travel in Afghanistan';

export const heroSlides: readonly HeroSlide[] = [
    {
        id: 1,
        title: 'Discover Afghanistan with trusted local guidance',
        subtitle:
            'Landscapes, heritage and hospitality — planned with people who know the country deeply.',
        status: 'Published',
        order: 1,
        updated: '2 days ago',
    },
    {
        id: 2,
        title: 'Experience a country rich in stories and tradition',
        subtitle:
            'Travel thoughtfully through ancient cities, dramatic valleys and welcoming communities.',
        status: 'Published',
        order: 2,
        updated: '3 days ago',
    },
    {
        id: 3,
        title: 'Plan an Afghanistan journey shaped around you',
        subtitle:
            'Explore at your pace with local insight, careful planning and personal support throughout.',
        status: 'Published',
        order: 3,
        updated: '1 week ago',
    },
    {
        id: 4,
        title: 'Walk ancient routes with guides who know every valley',
        subtitle:
            'A draft slide for the next homepage campaign — not yet visible on the public site.',
        status: 'Draft',
        order: 4,
        updated: 'Yesterday',
    },
];

export const publishedHeroSlides = heroSlides
    .filter((slide) => slide.status === 'Published')
    .sort((left, right) => left.order - right.order);
