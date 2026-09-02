import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { BookingLanding } from '@/components/sections/booking/BookingLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { BookingPageProps } from '@/types/customBooking';

export default function Booking({ destinations, seasons }: BookingPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Custom Tour Request"
                description="Request a custom Afghanistan tour. Share dates, destinations, travelers and services. Our team reviews every request and sends a quotation — this is not an instant booking."
            />
            <BookingLanding destinations={destinations} seasons={seasons} />
        </>
    );
}

Booking.layout = PublicLayout;
