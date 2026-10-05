import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

import { formatShortDuration } from '@/components/sections/tours/tourDisplay';
import { FadeInOnMount } from '@/components/motion/FadeIn';
import type { TravelOfferDetail } from '@/types/travelOffer';

interface OfferDetailHeroProps {
    offer: TravelOfferDetail;
    onRequest: () => void;
}

export function OfferDetailHero({ offer, onRequest }: OfferDetailHeroProps) {
    const duration = formatShortDuration(offer.durationDays, offer.durationLabel);

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
                        href={offer.breadcrumbs.listHref}
                        className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        {offer.breadcrumbs.listLabel}
                    </Link>
                    <span aria-hidden>/</span>
                    <span className="text-foreground" aria-current="page">
                        {offer.title}
                    </span>
                </nav>

                <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div className="text-start">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                <Clock className="size-3" aria-hidden />
                                {duration}
                            </span>
                            {offer.badge ? (
                                <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                                    {offer.badge}
                                </span>
                            ) : null}
                        </div>

                        <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                            {offer.title}
                        </h1>

                        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                            {offer.tagline}
                        </p>

                        {offer.priceLabel ? (
                            <p className="font-heading mt-5 text-lg font-semibold text-foreground">
                                {offer.priceLabel}
                            </p>
                        ) : null}

                        <p className={`text-xs text-muted-foreground ${offer.priceLabel ? 'mt-1' : 'mt-5'}`}>
                            Inquiry-based pricing — final quote confirmed by email.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={onRequest}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                {offer.labels.request}
                                <ArrowRight className="size-4" aria-hidden />
                            </button>
                            <Link
                                href={offer.breadcrumbs.listHref}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <ArrowLeft className="size-4" aria-hidden />
                                {offer.labels.back}
                            </Link>
                        </div>
                    </div>

                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted shadow-sm">
                        <img
                            src={offer.image}
                            alt={offer.title}
                            width={1000}
                            height={750}
                            className="size-full object-cover"
                            decoding="async"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                </div>
                </FadeInOnMount>
            </div>
        </section>
    );
}
