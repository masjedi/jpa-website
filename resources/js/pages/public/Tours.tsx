import { Head, setLayoutProps } from '@inertiajs/react';

import { ToursLanding } from '@/components/sections/tours/ToursLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Tours() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <Head>
                <title>Tours & Packages</title>
                <meta
                    name="description"
                    content="Explore curated Afghan tour packages, small group departures, and tailored itineraries across Bamiyan, Herat, Kabul, Wakhan, and Mazar-i-Sharif."
                />
            </Head>

            <ToursLanding />
        </>
    );
}

Tours.layout = PublicLayout;
