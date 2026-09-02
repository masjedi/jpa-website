import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutLanding } from '@/components/sections/about/AboutLanding';
import { useTranslations } from '@/hooks/use-translations';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { AboutPageContent, PublicAboutJourneyStep } from '@/types/aboutPage';

interface AboutPageProps {
    content: AboutPageContent;
    journeySteps: PublicAboutJourneyStep[];
}

export default function About({ content, journeySteps }: AboutPageProps) {
    setLayoutProps({ transparentHeader: false });
    const { t } = useTranslations();

    return (
        <>
            <PageMeta title={t('nav.about')} description={content.intro.description} />
            <AboutLanding content={content} journeySteps={journeySteps} />
        </>
    );
}

About.layout = PublicLayout;
