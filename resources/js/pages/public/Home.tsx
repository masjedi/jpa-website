import { Head, setLayoutProps } from '@inertiajs/react';

import { HomeLanding } from '@/components/sections/home/HomeLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Home() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <Head>
                <title>Home</title>
                <meta
                    name="description"
                    content="Discover Afghanistan through premium guided travel, local expertise and thoughtfully planned journeys."
                />
            </Head>

            <HomeLanding />
        </>
    );
}

Home.layout = PublicLayout;
