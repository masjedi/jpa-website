import { Link } from '@inertiajs/react';
import { ChevronRight, Compass } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { customBookingHref } from '@/components/public/navigation';
import { useTranslations } from '@/hooks/use-translations';

export function ToursHero() {
    const { t } = useTranslations();

    return (
        <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.35)_0%,transparent_45%)]"
            />

            <div className="relative z-10 mx-auto max-w-3xl px-4 pb-14 pt-32 text-center sm:px-6 lg:pb-16 lg:pt-36">
                <FadeInOnMount>
                <nav
                    aria-label={t('common.breadcrumb')}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-brand-on-surface/65"
                >
                    <Link
                        href="/"
                        className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        {t('common.home')}
                    </Link>
                    <ChevronRight className="size-3.5 opacity-50 rtl:rotate-180" aria-hidden />
                    <span className="text-brand-on-surface" aria-current="page">
                        {t('nav.toursAndPackages')}
                    </span>
                </nav>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                    {t('toursPage.hero.eyebrow')}
                </p>

                <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl lg:text-5xl">
                    {t('toursPage.hero.title')}
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                    {t('toursPage.hero.description')}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <a
                        href="#packages"
                        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        {t('buttons.viewPackages')}
                    </a>
                    <a
                        href="#tour-catalog"
                        className="inline-flex items-center justify-center rounded-full border border-brand-on-surface/25 px-6 py-2.5 text-sm font-medium text-brand-on-surface transition-colors hover:bg-brand-on-surface/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        {t('buttons.browseTours')}
                    </a>
                    <Link
                        href={customBookingHref}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-brand-on-surface/80 transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <Compass className="size-4 text-accent" aria-hidden />
                        <span>{t('buttons.customTrip')}</span>
                    </Link>
                </div>
                </FadeInOnMount>
            </div>
        </section>
    );
}
