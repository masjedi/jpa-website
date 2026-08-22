import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Compass } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import type { Destination } from '@/types/destinations';

interface DestinationDetailHeroProps {
    destination: Destination;
    onPlanTrip: () => void;
}

export function DestinationDetailHero({
    destination,
    onPlanTrip,
}: DestinationDetailHeroProps) {
    return (
        <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <FadeInOnMount>
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Home
                        </Link>
                        <span aria-hidden>/</span>
                        <Link
                            href="/destinations"
                            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Destinations
                        </Link>
                        <span aria-hidden>/</span>
                        <span className="text-foreground" aria-current="page">
                            {destination.name}
                        </span>
                    </nav>

                    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div className="text-start">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                    {destination.region}
                                </span>
                                {destination.badge ? (
                                    <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                                        {destination.badge}
                                    </span>
                                ) : null}
                            </div>

                            <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                {destination.name}
                            </h1>

                            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                                {destination.tagline}
                            </p>

                            {destination.bestSeason || destination.travelStyle ? (
                                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    {destination.bestSeason ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar className="size-4 text-secondary" aria-hidden />
                                            Best: {destination.bestSeason}
                                        </span>
                                    ) : null}
                                    {destination.travelStyle ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Compass className="size-4 text-secondary" aria-hidden />
                                            {destination.travelStyle}
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={onPlanTrip}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Plan a trip here
                                    <ArrowRight className="size-4" aria-hidden />
                                </button>
                                <Link
                                    href="/destinations"
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    <ArrowLeft className="size-4" aria-hidden />
                                    All destinations
                                </Link>
                            </div>
                        </div>

                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted shadow-sm">
                            <img
                                src={destination.image}
                                alt={destination.name}
                                width={1000}
                                height={750}
                                className="size-full object-cover"
                                decoding="async"
                                fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </FadeInOnMount>
            </div>
        </section>
    );
}
