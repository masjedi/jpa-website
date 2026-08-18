import { Link } from '@inertiajs/react';
import { ArrowRight, Check, MapPin } from 'lucide-react';

import { destinationShowHref } from '@/components/public/navigation';
import { BorderGlow } from '@/components/react-bits/BorderGlow/BorderGlow';
import { FadeIn } from '@/components/motion/FadeIn';
import { getRelatedDestinations } from '@/data/destinationsData';
import { getToursForDestination } from '@/data/destinationTours';
import type { Destination } from '@/types/destinations';

interface DestinationDetailBodyProps {
    destination: Destination;
    onPlanTrip: () => void;
}

export function DestinationDetailBody({
    destination,
    onPlanTrip,
}: DestinationDetailBodyProps) {
    const relatedTours = getToursForDestination(destination);
    const relatedDestinations = getRelatedDestinations(destination.slug, 2);

    return (
        <>
            <section className="bg-background py-10 sm:py-14">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <div className="space-y-10 text-start lg:col-span-2">
                        <FadeIn>
                            <div>
                                <h2 className="font-heading text-xl font-semibold text-foreground">
                                    About this destination
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    {destination.description}
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.05}>
                            <div>
                                <h2 className="font-heading text-xl font-semibold text-foreground">
                                    Highlights
                                </h2>
                                <ul className="mt-4 space-y-3">
                                    {destination.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="flex items-start gap-3 text-sm text-muted-foreground"
                                        >
                                            <Check
                                                className="mt-0.5 size-4 shrink-0 text-secondary"
                                                aria-hidden
                                            />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>

                        {relatedTours.length > 0 ? (
                            <FadeIn delay={0.1}>
                                <div>
                                    <h2 className="font-heading text-xl font-semibold text-foreground">
                                        Tours that visit here
                                    </h2>
                                    <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
                                        {relatedTours.slice(0, 4).map((tour) => (
                                            <li
                                                key={tour.id}
                                                className="flex items-center justify-between gap-4 px-4 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-heading text-sm font-semibold text-foreground">
                                                        {tour.title}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {tour.duration} · {tour.travelStyle}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/tours#tour-catalog"
                                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
                                    >
                                        Browse all tours
                                        <ArrowRight className="size-4" aria-hidden />
                                    </Link>
                                </div>
                            </FadeIn>
                        ) : null}
                    </div>

                    <aside className="lg:col-span-1">
                        <FadeIn delay={0.08}>
                            <div className="sticky top-28 space-y-4">
                                <BorderGlow
                                    className="rounded-2xl"
                                    backgroundColor="var(--surface)"
                                    borderRadius={16}
                                    colors={['#0E7373', '#163B5C', '#D7A23A']}
                                    glowColor="182 78 26"
                                    edgeSensitivity={24}
                                    animated={false}
                                >
                                    <div className="rounded-2xl border border-border bg-surface p-5 text-start">
                                        <h2 className="font-heading text-lg font-semibold text-foreground">
                                            Know before you go
                                        </h2>
                                        <ul className="mt-4 space-y-2.5">
                                            {destination.practicalNotes.map((note) => (
                                                <li
                                                    key={note}
                                                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                                                >
                                                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-secondary" />
                                                    <span>{note}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </BorderGlow>

                                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Ready to plan?
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        Tell us your dates and interests — we
                                        will shape an itinerary around{' '}
                                        {destination.name}.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={onPlanTrip}
                                        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        Send trip inquiry
                                        <ArrowRight className="size-4" aria-hidden />
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    </aside>
                </div>
            </section>

            {relatedDestinations.length > 0 ? (
                <section className="border-t border-border bg-surface-muted/30 py-10 sm:py-14">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <FadeIn>
                            <div className="flex items-end justify-between gap-4 text-start">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                        Nearby regions
                                    </p>
                                    <h2 className="font-heading mt-1.5 text-xl font-semibold text-foreground sm:text-2xl">
                                        More to explore
                                    </h2>
                                </div>
                                <Link
                                    href="/destinations"
                                    className="hidden text-sm font-medium text-secondary hover:underline sm:inline"
                                >
                                    View all
                                </Link>
                            </div>
                        </FadeIn>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            {relatedDestinations.map((related, index) => (
                                <FadeIn key={related.id} delay={index * 0.05}>
                                    <Link
                                        href={destinationShowHref(related.slug)}
                                        className="group flex overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="relative w-32 shrink-0 overflow-hidden bg-surface-muted sm:w-36">
                                            <img
                                                src={related.image}
                                                alt={related.name}
                                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col p-4 text-start">
                                            <p className="text-xs font-medium text-secondary">
                                                {related.region}
                                            </p>
                                            <h3 className="font-heading mt-1 text-sm font-semibold text-foreground">
                                                {related.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                                {related.tagline}
                                            </p>
                                            <p className="mt-auto flex items-center gap-1 pt-3 text-xs font-medium text-secondary">
                                                <MapPin className="size-3.5" aria-hidden />
                                                Explore
                                            </p>
                                        </div>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
}
