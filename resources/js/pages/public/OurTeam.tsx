import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { AboutTeamSection } from '@/components/sections/about/AboutTeamSection';
import { useTranslations } from '@/hooks/use-translations';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { PublicTeamMember } from '@/types/team';

interface OurTeamPageProps {
    members: PublicTeamMember[];
}

export default function OurTeam({ members }: OurTeamPageProps) {
    setLayoutProps({ transparentHeader: true });
    const { t } = useTranslations();

    return (
        <>
            <PageMeta
                title={t('teamPage.meta.title')}
                description={t('teamPage.meta.description')}
            />
            <AboutTeamSection members={members} />
        </>
    );
}

OurTeam.layout = PublicLayout;
