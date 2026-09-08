import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutLanding } from '@/components/sections/about/AboutLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { AboutPageContent, PublicAboutJourneyStep } from '@/types/aboutPage';

interface AboutPageProps {
    content: AboutPageContent;
    journeySteps: PublicAboutJourneyStep[];
}

export default function About({ content, journeySteps }: AboutPageProps) {
    setLayoutProps({ transparentHeader: false });

    return (
        <>
            <PageMeta />
            <AboutLanding content={content} journeySteps={journeySteps} />
        </>
    );
}

About.layout = PublicLayout;
