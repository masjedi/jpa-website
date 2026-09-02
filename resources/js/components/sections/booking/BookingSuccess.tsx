import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

import { CUSTOM_BOOKING_STATUS_LABELS } from '@/types/customBooking';
import type { CustomBookingSuccess } from '@/types/customBooking';
import { displayDate } from '@/components/sections/booking/bookingModel';
import { useTranslations } from '@/hooks/use-translations';

interface BookingSuccessProps {
    summary: CustomBookingSuccess;
}

export function BookingSuccess({ summary }: BookingSuccessProps) {
    const { t } = useTranslations();

    return (
        <div className="px-4 py-10 text-center sm:px-8 sm:py-12" role="status">
            <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle2 className="size-7" aria-hidden />
            </div>
            <h2 className="font-heading mt-6 text-2xl font-semibold text-foreground sm:text-3xl">
                Thank you, {summary.firstName}. Your custom tour request has been received.
            </h2>
            <dl className="mx-auto mt-8 max-w-md space-y-3 text-start text-sm">
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-muted-foreground">Reference</dt>
                    <dd className="font-medium text-foreground">{summary.reference}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium text-foreground">
                        {CUSTOM_BOOKING_STATUS_LABELS[summary.status]}
                    </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-muted-foreground">Preferred travel date</dt>
                    <dd className="font-medium text-foreground">
                        {displayDate(summary.preferredDate) || 'To be decided'}
                    </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-muted-foreground">Travelers</dt>
                    <dd className="font-medium text-foreground">{summary.travelerCount}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">Confirmation email</dt>
                    <dd className="font-medium text-foreground">{summary.email}</dd>
                </div>
            </dl>
            <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
                A confirmation email is on its way to {summary.email}. Our travel team will review
                your requested route and services and contact you with a detailed itinerary and
                quotation. Typical reply within 24–48 hours.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    {t('buttons.backToHome')}
                </Link>
                <Link
                    href="/tours"
                    className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    Browse tours
                </Link>
            </div>
        </div>
    );
}
