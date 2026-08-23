import { setLayoutProps, usePage } from '@inertiajs/react';

import { BRAND_NAME } from '@/components/public/brand';
import { PageMeta } from '@/components/public/PageMeta';
import { HomeLanding } from '@/components/sections/home/HomeLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { PublicHeroSection } from '@/types/heroSection';
import type { SharedPageProps } from '@/types/inertia';

interface HomePageProps extends SharedPageProps {
    hero: PublicHeroSection;
}

export default function Home() {
    setLayoutProps({ transparentHeader: true });

    const { hero } = usePage<HomePageProps>().props;
    const leadSlide = hero.slides[0];
    const description =
        leadSlide?.subtitle?.trim() ||
        'Discover Afghanistan through premium guided travel, local expertise and thoughtfully planned journeys. Inquiries are reviewed personally — not instant bookings.';

    return (
        <>
            <PageMeta title={BRAND_NAME} description={description} />
            <HomeLanding
                key={`hero-${hero.eyebrow}-${hero.slides.map((slide) => slide.id).join('-')}`}
                hero={hero}
            />
        </>
    );
}

Home.layout = PublicLayout;
