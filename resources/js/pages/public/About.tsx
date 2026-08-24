import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutLanding } from '@/components/sections/about/AboutLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function About() {
    setLayoutProps({ transparentHeader: false });

    return (
        <>
            <PageMeta
                title="About"
                description="Discover Journey to Peace Afghanistan Tours — our story of Afghan-led guiding, cultural heritage journeys and the milestones shaping responsible tourism across Afghanistan."
            />
            <AboutLanding />
        </>
    );
}

About.layout = PublicLayout;
