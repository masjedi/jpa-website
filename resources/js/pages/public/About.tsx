import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutLanding } from '@/components/sections/about/AboutLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function About() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="About"
                description="Meet Journey to Peace Afghanistan Tours — a small Afghan team guiding travellers with local expertise, transparent planning and cultural respect."
            />
            <AboutLanding />
        </>
    );
}

About.layout = PublicLayout;
