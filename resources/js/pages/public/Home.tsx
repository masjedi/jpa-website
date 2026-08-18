import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { HomeLanding } from '@/components/sections/home/HomeLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Home() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Guided Travel in Afghanistan"
                description="Discover Afghanistan through premium guided travel, local expertise and thoughtfully planned journeys. Inquiries are reviewed personally — not instant bookings."
            />
            <HomeLanding />
        </>
    );
}

Home.layout = PublicLayout;
