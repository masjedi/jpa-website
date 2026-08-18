import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ServicesLanding } from '@/components/sections/services/ServicesLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Services() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Services"
                description="Guided tours, private travel, custom itineraries, local guides, transport, accommodation, visa support and safety briefings for travel in Afghanistan."
            />
            <ServicesLanding />
        </>
    );
}

Services.layout = PublicLayout;
