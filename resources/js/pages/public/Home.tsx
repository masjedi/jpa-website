import { setLayoutProps, usePage } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { HomeLanding } from '@/components/sections/home/HomeLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { ArticleListItem } from '@/types/articles';
import type { Destination } from '@/types/destinations';
import type { GalleryPhoto } from '@/types/gallery';
import type { PublicHeroSection } from '@/types/heroSection';
import type { PublicFaqItem } from '@/types/faq';
import type { PublicTestimonial } from '@/types/testimonials';
import type { SharedPageProps } from '@/types/inertia';
import type { HomeServicePreview } from '@/types/services';
import type { Tour } from '@/types/tours';

interface HomePageProps extends SharedPageProps {
    hero: PublicHeroSection;
    featuredTours?: Tour[];
    featuredDestinations?: Destination[];
    galleryPreview?: GalleryPhoto[];
    latestArticles?: ArticleListItem[];
    faqItems?: PublicFaqItem[];
    testimonials?: PublicTestimonial[];
    homeServices: HomeServicePreview[];
    homeServicesImage: string;
}

export default function Home() {
    setLayoutProps({ transparentHeader: true });

    const {
        hero,
        featuredTours,
        featuredDestinations,
        galleryPreview,
        latestArticles,
        faqItems,
        testimonials,
        homeServices,
        homeServicesImage,
    } = usePage<HomePageProps>().props;

    return (
        <>
            <PageMeta />

            <HomeLanding
                key={`hero-${hero.eyebrow}-${hero.slides
                    .map((slide) => slide.id)
                    .join('-')}`}
                hero={hero}
                homeServices={homeServices}
                homeServicesImage={homeServicesImage}
                featuredTours={featuredTours}
                featuredDestinations={featuredDestinations}
                galleryPreview={galleryPreview}
                latestArticles={latestArticles}
                faqItems={faqItems}
                testimonials={testimonials}
            />
        </>
    );
}

Home.layout = PublicLayout;
