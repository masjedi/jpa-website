import { ArrowRight } from 'lucide-react';

import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { tourPackages } from '@/data/toursData';
import type { TourPackage } from '@/types/tours';

interface TourPackagesSectionProps {
    onSelectPackage: (pkg: TourPackage) => void;
}

export function TourPackagesSection({
    onSelectPackage,
}: TourPackagesSectionProps) {
    return (
        <section id="packages" className="border-b border-border bg-surface-muted/30 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Travel packages
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            Ready-to-request packages
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-muted-foreground">
                        All-inclusive bundles — inquiry only, no instant booking.
                    </p>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {tourPackages.map((pkg) => (
                        <article
                            key={pkg.id}
                            className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-muted">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="size-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                <TourOfferBadges
                                    durationDays={pkg.durationDays}
                                    durationLabel={pkg.duration}
                                    highlight={pkg.badge}
                                />
                                <p className="absolute inset-x-3 bottom-3 font-heading text-sm font-semibold leading-snug text-white line-clamp-2 drop-shadow">
                                    {pkg.title}
                                </p>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                    {pkg.tagline}
                                </p>

                                <p className="mt-2 text-[11px] text-muted-foreground line-clamp-1">
                                    {pkg.keyDestinations.slice(0, 3).join(' · ')}
                                    {pkg.keyDestinations.length > 3
                                        ? ` +${pkg.keyDestinations.length - 3}`
                                        : ''}
                                </p>

                                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                                    <p className="font-heading text-sm font-semibold text-foreground">
                                        {pkg.priceEstimate}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => onSelectPackage(pkg)}
                                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        Request
                                        <ArrowRight className="size-3.5" aria-hidden />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
