import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { LazyDomeGallery } from '@/components/sections/gallery/LazyDomeGallery';
import { galleryImages } from '@/data/galleryData';

const domeImages = galleryImages.map((image) => ({
    src: image.src,
    alt: image.alt,
}));

export function GalleryHero() {
    return (
        <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.35)_0%,transparent_45%)]"
            />

            <div className="relative z-10 mx-auto max-w-3xl px-4 pb-10 pt-32 text-center sm:px-6 lg:pb-12 lg:pt-36">
                <FadeInOnMount>
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center justify-center gap-2 text-xs font-medium text-brand-on-surface/65"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Home
                        </Link>
                        <ChevronRight className="size-3.5 opacity-50" aria-hidden />
                        <span className="text-brand-on-surface" aria-current="page">
                            Gallery
                        </span>
                    </nav>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                        Travel photography
                    </p>

                    <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl lg:text-5xl">
                        Gallery
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                        Landscapes, cities and everyday moments from journeys across Afghanistan —
                        explore the dome below and tap any image to view it larger.
                    </p>
                </FadeInOnMount>
            </div>
        </section>
    );
}

export function GalleryDomeSection() {
    return (
        <section
            id="gallery-dome"
            aria-label="Interactive photo gallery"
            className="relative bg-brand-deep"
        >
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-brand-on-surface/65">
                    Drag to explore · Click or tap a tile to enlarge · Press Escape to close
                </p>
            </div>

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

            <div className="mx-auto max-w-2xl px-4 pb-16 pt-6 text-center sm:px-6">
                <p className="text-sm leading-relaxed text-brand-on-surface/60">
                    Images shown are representative of regions and experiences we guide. Captions
                    and full-resolution sets are curated for each journey.
                </p>
            </div>
        </section>
    );
}

export function GalleryLanding() {
    return (
        <div className="w-full">
            <GalleryHero />
            <GalleryDomeSection />
        </div>
    );
}
