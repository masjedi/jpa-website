import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutTeamSection } from '@/components/sections/about/AboutTeamSection';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function OurTeam() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Our Team"
                description="Meet the JPA team — Afghan guides, planners and coordinators who design and lead every journey with local expertise and cultural respect."
            />
            <AboutTeamSection />
        </>
    );
}

OurTeam.layout = PublicLayout;
