import { Link } from '@inertiajs/react';
import { ArrowRight, Check, MapPin, Users } from 'lucide-react';

import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { cardSummaryClass, cardTitleClass } from '@/lib/cardText';
import { isRichTextHtml } from '@/lib/richText';
import type { TravelOfferDetail } from '@/types/travelOffer';

interface OfferDetailBodyProps {
    offer: TravelOfferDetail;
    onRequest: () => void;
}

export function OfferDetailBody({ offer, onRequest }: OfferDetailBodyProps) {
    const usesRichContent = Boolean(offer.content && isRichTextHtml(offer.content));

    return (
        <>
            <section className="bg-background py-10 sm:py-14">
                <FadeIn>
                <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <div className="space-y-10 text-start lg:col-span-2">
                        {usesRichContent ? (
                            <div
                                className="rich-text-content text-sm leading-relaxed text-muted-foreground sm:text-base [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-5"
                                dangerouslySetInnerHTML={{ __html: offer.content ?? '' }}
                            />
                        ) : (
                            <>
                                <div>
                                    <h2 className="font-heading text-xl font-semibold text-foreground">
                                        {offer.labels.about}
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                        {offer.description}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-heading text-xl font-semibold text-foreground">
                                        {offer.labels.highlights}
                                    </h2>
                                    <ul className="mt-4 space-y-3">
                                        {offer.highlights.map((highlight) => (
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

                                {offer.journeyOutline && offer.journeyOutline.length > 0 ? (
                                    <div>
                                        <h2 className="font-heading text-xl font-semibold text-foreground">
                                            {offer.kind === 'tour'
                                                ? 'Itinerary overview'
                                                : 'Journey outline'}
                                        </h2>
                                        <div className="mt-4 space-y-4">
                                            {offer.journeyOutline.map((phase) => (
                                                <div
                                                    key={`${phase.phase}-${phase.title}`}
                                                    className="rounded-xl border border-border bg-surface p-4"
                                                >
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                                        {phase.phase}
                                                    </p>
                                                    <h3 className="font-heading mt-1 text-sm font-semibold text-foreground">
                                                        {phase.title}
                                                    </h3>
                                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                                        {phase.summary}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}

                        <div>
                            <h2 className="font-heading text-xl font-semibold text-foreground">
                                {offer.kind === 'tour'
                                    ? 'Destination'
                                    : 'Destinations covered'}
                            </h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {offer.destinations.map((dest) => (
                                    <span
                                        key={dest}
                                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground"
                                    >
                                        <MapPin
                                            className="size-3 text-secondary"
                                            aria-hidden
                                        />
                                        {dest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
                            <h2 className="font-heading text-lg font-semibold text-foreground">
                                At a glance
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2.5 text-muted-foreground">
                                    <Users
                                        className="mt-0.5 size-4 shrink-0 text-secondary"
                                        aria-hidden
                                    />
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {offer.kind === 'tour'
                                                ? 'Trip details'
                                                : 'Ideal for'}
                                        </p>
                                        <p className="mt-0.5">{offer.sidebarIdealFor}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Included
                                </p>
                                {offer.inclusions.length > 0 ? (
                                    <>
                                        <ul className="mt-3 space-y-2">
                                            {offer.inclusions.slice(0, 5).map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                                                >
                                                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-secondary" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {offer.inclusions.length > 5 ? (
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                +{offer.inclusions.length - 5} more in your
                                                proposal
                                            </p>
                                        ) : null}
                                    </>
                                ) : (
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Details provided in your custom proposal.
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={onRequest}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Send booking request
                                <ArrowRight className="size-4" aria-hidden />
                            </button>

                            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                                No instant booking or online payment. Our team replies
                                within 24 hours.
                            </p>
                        </div>
                    </aside>
                </div>
                </FadeIn>
            </section>

            {offer.relatedItems.length > 0 ? (
                <section className="border-t border-border bg-surface-muted/30 py-10 sm:py-14">
                    <FadeIn>
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between gap-4 text-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                    {offer.labels.relatedEyebrow}
                                </p>
                                <h2 className="font-heading mt-1.5 text-xl font-semibold text-foreground sm:text-2xl">
                                    {offer.labels.relatedTitle}
                                </h2>
                            </div>
                            <Link
                                href={offer.breadcrumbs.listHref}
                                className="hidden text-sm font-medium text-secondary hover:underline sm:inline"
                            >
                                {offer.labels.relatedViewAll}
                            </Link>
                        </div>

                        <RevealStagger className="mt-6 grid gap-5 sm:grid-cols-2">
                            {offer.relatedItems.map((item) => (
                                <RevealItem key={item.slug} className="h-full">
                                <Link
                                    href={item.href}
                                    className="group flex h-full overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="relative w-24 shrink-0 overflow-hidden bg-surface-muted sm:w-36">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <TourOfferBadges
                                            durationDays={item.durationDays}
                                            durationLabel={item.durationLabel}
                                            highlight={item.badge}
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-4">
                                        <h3 className={`font-heading text-sm font-semibold text-foreground ${cardTitleClass}`}>
                                            {item.title}
                                        </h3>
                                        <p className={`mt-1 text-xs text-muted-foreground ${cardSummaryClass}`}>
                                            {item.tagline}
                                        </p>
                                        {item.priceLabel ? (
                                            <p className="mt-auto pt-3 text-xs font-semibold text-foreground">
                                                {item.priceLabel}
                                            </p>
                                        ) : null}
                                    </div>
                                </Link>
                                </RevealItem>
                            ))}
                        </RevealStagger>
                    </div>
                    </FadeIn>
                </section>
            ) : null}
        </>
    );
}
