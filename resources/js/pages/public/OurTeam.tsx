import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutTeamSection } from '@/components/sections/about/AboutTeamSection';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { PublicTeamMember } from '@/types/team';

interface OurTeamPageProps {
    members: PublicTeamMember[];
    bandImage: string;
}

export default function OurTeam({ members, bandImage }: OurTeamPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta />
            <AboutTeamSection members={members} bandImage={bandImage} />
        </>
    );
}

OurTeam.layout = PublicLayout;
