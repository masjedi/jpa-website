import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { useTranslations } from '@/hooks/use-translations';

interface DiscoveryHeroProps {
    imageUrl?: string | null;
}

export function DiscoveryHero({ imageUrl }: DiscoveryHeroProps) {
    const { t } = useTranslations();

    return (
        <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
            {imageUrl ? (
                <>
                    <img
                        src={imageUrl}
                        alt=""
                        width={1920}
                        height={720}
                        className="absolute inset-0 size-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div
                        className="absolute inset-0 bg-brand-deep/70 dark:bg-brand-deep/80"
                        aria-hidden
                    />
                </>
            ) : (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.35)_0%,transparent_45%)]"
                />
            )}

            <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pb-12 lg:px-8 lg:pt-32">
                <FadeInOnMount>
                    <nav
                        aria-label={t('common.breadcrumb')}
                        className="flex items-center gap-2 text-xs font-medium text-brand-on-surface/70"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('common.home')}
                        </Link>
                        <ChevronRight className="size-3.5 opacity-50 rtl:rotate-180" aria-hidden />
                        <span className="text-brand-on-surface" aria-current="page">
                            {t('nav.tours')}
                        </span>
                    </nav>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-on-surface/70">
                        {t('toursPage.hero.eyebrow')}
                    </p>

                    <h1 className="font-heading mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl">
                        {t('toursPage.hero.title')}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-on-surface/80 sm:text-base">
                        {t('toursPage.hero.description')}
                    </p>
                </FadeInOnMount>
            </div>
        </section>
    );
}
