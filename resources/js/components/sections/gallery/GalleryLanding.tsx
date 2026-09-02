import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { LazyDomeGallery } from '@/components/sections/gallery/LazyDomeGallery';
import { useTranslations } from '@/hooks/use-translations';
import type { GalleryPhoto } from '@/types/gallery';

interface GalleryLandingProps {
    photos: readonly GalleryPhoto[];
}

export function GalleryHero() {
    const { t } = useTranslations();

    return (
        <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.35)_0%,transparent_45%)]"
            />

            <div className="relative z-10 mx-auto max-w-3xl px-4 pb-10 pt-32 text-center sm:px-6 lg:pb-12 lg:pt-36">
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
                            {t('nav.gallery')}
                        </span>
                    </nav>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                        {t('galleryPage.hero.eyebrow')}
                    </p>

                    <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl lg:text-5xl">
                        {t('galleryPage.hero.title')}
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                        {t('galleryPage.hero.description')}
                    </p>
                </FadeInOnMount>
            </div>
        </section>
    );
}

export function GalleryDomeSection({ photos }: { photos: readonly GalleryPhoto[] }) {
    const { t } = useTranslations();
    const domeImages = photos.map((photo) => ({
        src: photo.src,
        alt: photo.alt,
    }));

    return (
        <section
            id="gallery-dome"
            aria-label={t('galleryPage.dome.ariaLabel')}
            className="relative bg-brand-deep"
        >
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-brand-on-surface/65">
                    {t('galleryPage.dome.instructions')}
                </p>
            </div>

            {domeImages.length > 0 ? (
                <LazyDomeGallery
                    images={domeImages}
                    overlayBlurColor="#071722"
                    fit={0.52}
                    minRadius={420}
                    maxRadius={760}
                    padFactor={0.2}
                    grayscale={false}
                    openedImageWidth="min(90vw, 420px)"
                    openedImageHeight="min(70vh, 560px)"
                    imageBorderRadius="20px"
                    openedImageBorderRadius="24px"
                />
            ) : (
                <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
                    <p className="text-sm leading-relaxed text-brand-on-surface/70">
                        {t('galleryPage.dome.empty')}
                    </p>
                </div>
            )}

            <div className="mx-auto max-w-2xl px-4 pb-16 pt-6 text-center sm:px-6">
                <p className="text-sm leading-relaxed text-brand-on-surface/60">
                    {t('galleryPage.dome.footnote')}
                </p>
            </div>
        </section>
    );
}

export function GalleryLanding({ photos }: GalleryLandingProps) {
    return (
        <div className="w-full">
            <GalleryHero />
            <GalleryDomeSection photos={photos} />
        </div>
    );
}
