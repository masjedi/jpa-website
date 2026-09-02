import { Link } from '@inertiajs/react';
import { ChevronRight, Newspaper } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { useTranslations } from '@/hooks/use-translations';

export function ArticlesHero() {
    const { t } = useTranslations();

    return (
        <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.35)_0%,transparent_45%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(215,162,58,0.1)_0%,transparent_38%)]"
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
                        <ChevronRight className="size-3.5 opacity-50" aria-hidden />
                        <span className="text-brand-on-surface" aria-current="page">
                            {t('nav.articles')}
                        </span>
                    </nav>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                        {t('articlesPage.hero.eyebrow')}
                    </p>

                    <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl lg:text-5xl">
                        {t('articlesPage.hero.title')}
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                        {t('articlesPage.hero.description')}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="#article-grid"
                            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('buttons.browseArticles')}
                        </a>
                        <a
                            href="#newsletter"
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-on-surface/25 px-6 py-2.5 text-sm font-medium text-brand-on-surface transition-colors hover:bg-brand-on-surface/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <Newspaper className="size-4 text-accent" aria-hidden />
                            {t('buttons.getUpdates')}
                        </a>
                    </div>
                </FadeInOnMount>
            </div>
        </section>
    );
}
