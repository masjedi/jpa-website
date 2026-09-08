import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { packageShowHref } from '@/components/public/navigation';
import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { useTranslations } from '@/hooks/use-translations';
import { cardLineClass, cardSummaryClass } from '@/lib/cardText';
import type { TourPackage } from '@/types/tours';

interface TourPackagesSectionProps {
    packages: TourPackage[];
    onSelectPackage: (pkg: TourPackage) => void;
}

export function TourPackagesSection({
    packages,
    onSelectPackage,
}: TourPackagesSectionProps) {
    const { t } = useTranslations();

    return (
        <section id="packages" className="scroll-mt-28 border-b border-border bg-surface-muted/30 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            {t('toursPage.packages.eyebrow')}
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            {t('toursPage.packages.title')}
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-muted-foreground">
                        {t('toursPage.packages.description')}
                    </p>
                </div>

                <RevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {packages.map((pkg) => (
                        <RevealItem key={pkg.id} className="h-full">
                        <article
                            className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md"
                        >
                            <Link
                                href={packageShowHref(pkg.slug)}
                                className="relative block aspect-[3/2] w-full overflow-hidden bg-surface-muted"
                            >
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
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
                            </Link>

                            <div className="flex flex-1 flex-col p-4">
                                <p className={`text-xs leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                                    {pkg.tagline}
                                </p>

                                <p className={`mt-2 text-[11px] text-muted-foreground ${cardLineClass}`}>
                                    {pkg.keyDestinations.slice(0, 3).join(' · ')}
                                    {pkg.keyDestinations.length > 3
                                        ? ` +${pkg.keyDestinations.length - 3}`
                                        : ''}
                                </p>

                                <div className="mt-auto space-y-3 border-t border-border pt-3">
                                    <p className="font-heading text-sm font-semibold leading-snug text-foreground">
                                        {pkg.priceEstimate}
                                    </p>
                                    <div className="flex gap-2">
                                        <Link
                                            href={packageShowHref(pkg.slug)}
                                            className="inline-flex flex-1 items-center justify-center rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            {t('buttons.view')}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onSelectPackage(pkg)}
                                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            {t('buttons.request')}
                                            <ArrowRight className="size-3.5" aria-hidden />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                        </RevealItem>
                    ))}
                </RevealStagger>
                </FadeIn>
            </div>
        </section>
    );
}
