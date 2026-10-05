import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ServicesLanding } from '@/components/sections/services/ServicesLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { PublicServiceOffering } from '@/types/services';

interface ServicesPageProps {
    offerings: PublicServiceOffering[];
}

export default function Services({ offerings }: ServicesPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta />
            <ServicesLanding offerings={offerings} />
        </>
    );
}

Services.layout = PublicLayout;
