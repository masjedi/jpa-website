import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { CustomBookingForm } from '@/components/sections/booking/CustomBookingForm';

interface BookingLandingProps {
    destinations: readonly string[];
    seasons: readonly string[];
}

export function BookingLanding({ destinations, seasons }: BookingLandingProps) {
    return (
        <div className="w-full">
            <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.35)_0%,transparent_45%)]"
                />
                <div className="relative z-10 mx-auto max-w-3xl px-4 pb-14 pt-32 text-center sm:px-6 lg:pb-16 lg:pt-36">
                    <FadeInOnMount>
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center justify-center gap-2 text-xs font-medium text-brand-on-surface/65"
                        >
                            <Link
                                href="/"
                                className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Home
                            </Link>
                            <ChevronRight className="size-3.5 opacity-50" aria-hidden />
                            <span className="text-brand-on-surface" aria-current="page">
                                Custom tour request
                            </span>
                        </nav>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                            Plan a custom journey
                        </p>
                        <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl lg:text-5xl">
                            Custom package booking
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                            Share how you would like to travel in Afghanistan. Our team will review
                            your request and send a detailed itinerary and quotation — this is not an
                            instant booking.
                        </p>
                    </FadeInOnMount>
                </div>
            </section>

            <section className="bg-background py-10 sm:py-14">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <div className="overflow-hidden rounded-[28px] border border-border bg-surface">
                        <CustomBookingForm destinations={destinations} seasons={seasons} />
                    </div>
                </div>
            </section>
        </div>
    );
}
