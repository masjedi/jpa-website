import { Link } from '@inertiajs/react';
import { useMemo } from "react";
import {
    ArrowRight,
    Compass,
    MapPinned,
    MessageCircle,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

import type { PublicFaqItem } from '@/types/faq';
import type { PublicTestimonial } from '@/types/testimonials';
import type { HomeServicePreview } from '@/types/services';
import { SpotlightCard } from "@/components/react-bits/SpotlightCard/SpotlightCard";
import { FadeIn, RevealItem, RevealStagger } from "@/components/motion/FadeIn";
import { cardSummaryClass, cardSubtitleClass, cardTitleClass } from "@/lib/cardText";
import { destinationShowHref, articleShowHref } from "@/components/public/navigation";
import { DonateButton } from "@/components/public/DonateButton";
import { HomeDeferredSection } from '@/components/loading/HomeDeferredSection';
import { DeferredTestimonialsCarousel } from '@/components/sections/home/HomeDeferredSections';
import { HeroCarousel } from '@/components/sections/home/HeroCarousel';
import { HomeServicesSection } from '@/components/sections/home/HomeServicesSection';
import { useTranslations } from '@/hooks/use-translations';
import type { ArticleListItem } from '@/types/articles';
import type { Destination } from '@/types/destinations';
import type { GalleryPhoto } from '@/types/gallery';
import type { PublicHeroSection } from '@/types/heroSection';
import type { HomeFinderOptions } from '@/types/tourFilterOptions';
import type { Tour } from '@/types/tours';

/* -------------------------------------------------------------------------- */
/*  Static home content (non-backend sections)                                 */
/* -------------------------------------------------------------------------- */

interface FinderOption {
    value: string;
    label: string;
}

interface TrustIndicator {
    icon: LucideIcon;
    title: string;
    description: string;
}

/* Finder helpers ----------------------------------------------------------- */

function withAnyOption(
    values: readonly string[] | readonly { value: string; label: string }[],
    anyValue: string,
    anyLabel: string,
): FinderOption[] {
    return [
        { value: anyValue, label: anyLabel },
        ...values.map((value) =>
            typeof value === 'string' ? { value, label: value } : value,
        ),
    ];
}

/* Trust indicators --------------------------------------------------------- */

function useTrustIndicators(): readonly TrustIndicator[] {
    const { t } = useTranslations();

    return useMemo(
        () => [
            {
                icon: MapPinned,
                title: t('home.trust.localExpertise.title'),
                description: t('home.trust.localExpertise.description'),
            },
            {
                icon: Compass,
                title: t('home.trust.tailoredPlanning.title'),
                description: t('home.trust.tailoredPlanning.description'),
            },
            {
                icon: ShieldCheck,
                title: t('home.trust.responsibleTourism.title'),
                description: t('home.trust.responsibleTourism.description'),
            },
            {
                icon: MessageCircle,
                title: t('home.trust.humanSupport.title'),
                description: t('home.trust.humanSupport.description'),
            },
        ],
        [t],
    );
}

/* Section header helper ------------------------------------------------------- */

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    center?: boolean;
    action?: { label: string; href: string };
}

function SectionHeader({
    eyebrow,
    title,
    description,
    center = false,
    action,
}: SectionHeaderProps) {
    return (
        <div>
            {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
                    {eyebrow}
                </p>
            ) : null}
            <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                {title}
            </h2>
            {description ? (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {description}
                </p>
            ) : null}
            {action ? (
                <div className={center ? "mt-6 flex justify-center" : "mt-6"}>
                    {action.href.startsWith("/") && !action.href.includes("#") ? (
                        <Link
                            href={action.href}
                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {action.label}
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    ) : (
                        <a
                            href={action.href}
                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {action.label}
                            <ArrowRight className="size-4" aria-hidden />
                        </a>
                    )}
                </div>
            ) : null}
        </div>
    );
}

/* Shared card --------------------------------------------------------------- */

function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}

/* Badge ---------------------------------------------------------------------- */

function Badge({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
        >
            {children}
        </span>
    );
}

/* -------------------------------------------------------------------------- */
/*  Home landing                                                               */
/* -------------------------------------------------------------------------- */

export function HomeLanding({
    hero,
    finderOptions,
    homeServices = [],
    homeServicesImage,
    featuredTours,
    featuredDestinations,
    galleryPreview,
    latestArticles,
    faqItems,
    testimonials,
}: {
    hero: PublicHeroSection;
    finderOptions: HomeFinderOptions;
    homeServices?: readonly HomeServicePreview[];
    homeServicesImage?: string;
    featuredTours?: readonly Tour[];
    featuredDestinations?: readonly Destination[];
    galleryPreview?: readonly GalleryPhoto[];
    latestArticles?: readonly ArticleListItem[];
    faqItems?: readonly PublicFaqItem[];
    testimonials?: readonly PublicTestimonial[];
}) {
    const { t } = useTranslations();
    const trustIndicators = useTrustIndicators();

    const destinationOptions = withAnyOption(
        finderOptions.destinations,
        'all',
        t('home.finder.allDestinations'),
    );
    const travelStyleOptions = withAnyOption(
        finderOptions.travelStyles,
        'any',
        t('home.finder.anyTravelStyle'),
    );
    const seasonOptions = withAnyOption(finderOptions.seasons, 'any', t('home.finder.anySeason'));
    const groupTypeOptions = withAnyOption(
        finderOptions.groupTypes,
        'any',
        t('home.finder.anyGroupType'),
    );

    return (
        <>
            <HeroCarousel
                slides={hero.slides}
                eyebrow={hero.eyebrow}
                carouselLabel={t('home.hero.carouselLabel')}
                chooseMessageLabel={t('home.hero.chooseMessage')}
                showMessageLabel={(current, total) =>
                    t('home.hero.showMessage', { current, total })
                }
                emptySlidesLabel={t('home.hero.emptySlides')}
                exploreToursLabel={t('buttons.exploreTours')}
                sendInquiryLabel={t('buttons.sendInquiry')}
                donateButton={<DonateButton variant="hero" />}
            />

            {/* Quick Tour Finder --------------------------------------------- */}
            <section
                id="booking"
                className="border-b border-border bg-background py-12 sm:py-16"
            >
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    {t('home.finder.destination')}
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label={t('home.finder.destination')}
                                >
                                    {destinationOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    {t('home.finder.travelStyle')}
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label={t('home.finder.travelStyle')}
                                >
                                    {travelStyleOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    {t('home.finder.preferredSeason')}
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label={t('home.finder.preferredSeason')}
                                >
                                    {seasonOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    {t('home.finder.groupType')}
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label={t('home.finder.groupType')}
                                >
                                    {groupTypeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex items-end">
                                <Link
                                    href="/tours"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    {t('buttons.findTours')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </FadeIn>
            </section>

            {/* Trust Indicators ------------------------------------------------ */}
            <section id="trust" className="bg-background py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {trustIndicators.map((point) => (
                            <RevealItem key={point.title} className="h-full">
                                <SpotlightCard
                                    className="h-full rounded-2xl border border-border bg-surface p-6 text-start shadow-sm"
                                    spotlightColor="rgba(14, 115, 115, 0.22)"
                                >
                                    <point.icon
                                        className="size-6 text-secondary"
                                        aria-hidden
                                    />
                                    <h3 className={`mt-4 font-heading text-lg font-semibold text-foreground ${cardTitleClass}`}>
                                        {point.title}
                                    </h3>
                                    <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                                        {point.description}
                                    </p>
                                </SpotlightCard>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                </div>
                </FadeIn>
            </section>

            {/* Featured Tours -------------------------------------------------- */}
            <section id="tours" className="bg-surface-muted py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow={t('home.featuredTours.eyebrow')}
                        title={t('home.featuredTours.title')}
                        description={t('home.featuredTours.description')}
                        action={{ label: t('buttons.viewAllTours'), href: "/tours" }}
                    />
                    <HomeDeferredSection data="featuredTours" columns={3}>
                    <RevealStagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {(featuredTours ?? []).map((tour) => (
                            <RevealItem key={tour.slug} className="h-full">
                                <Card>
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={tour.image}
                                            alt={tour.title}
                                            width={900}
                                            height={675}
                                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6 text-start">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className="bg-secondary/15 text-secondary">
                                                {tour.travelStyle}
                                            </Badge>
                                            <Badge className="bg-surface-muted text-muted-foreground">
                                                {tour.difficulty}
                                            </Badge>
                                        </div>
                                        <h3 className={`mt-4 font-heading text-xl font-semibold text-foreground ${cardTitleClass}`}>
                                            {tour.title}
                                        </h3>
                                        <p className={`mt-1 text-sm text-muted-foreground ${cardSubtitleClass}`}>
                                            {tour.destination} · {tour.duration}
                                        </p>
                                        <p className={`mt-3 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                                            {tour.description}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-5">
                                            <p className="text-sm font-semibold text-foreground">
                                                {t('buttons.priceOnRequest')}
                                            </p>
                                            <a
                                                href="#contact"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                            >
                                                {t('buttons.requestThisTour')}
                                                <ArrowRight
                                                    className="size-4"
                                                    aria-hidden
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                    </HomeDeferredSection>
                </div>
                </FadeIn>
            </section>

            {/* Featured Destinations -------------------------------------------- */}
            <section id="destinations" className="bg-background py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow={t('home.destinations.eyebrow')}
                        title={t('home.destinations.title')}
                        description={t('home.destinations.description')}
                        action={{
                            label: t('buttons.exploreAllDestinations'),
                            href: "/tours?view=destinations",
                        }}
                    />
                    <HomeDeferredSection data="featuredDestinations" columns={4}>
                    <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {(featuredDestinations ?? []).map((destination) => (
                            <RevealItem key={destination.slug} className="h-full">
                                <Card>
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            width={900}
                                            height={675}
                                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5 text-start">
                                        <h3 className={`font-heading text-lg font-semibold text-foreground ${cardTitleClass}`}>
                                            {destination.name}
                                        </h3>
                                        <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                                            {destination.tagline}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-4">
                                            <p className="text-xs text-muted-foreground">
                                                {destination.linkedToursCount ?? 0}{" "}
                                                {(destination.linkedToursCount ?? 0) === 1
                                                    ? t('home.destinations.relatedTour')
                                                    : t('home.destinations.relatedTours')}
                                            </p>
                                            <Link
                                                href={destinationShowHref(destination.slug)}
                                                className="text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                            >
                                                {t('buttons.explore')}
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                    </HomeDeferredSection>
                </div>
                </FadeIn>
            </section>

            <HomeServicesSection
                services={homeServices}
                imageSrc={homeServicesImage ?? ''}
            />

            {/* Gallery Preview ------------------------------------------------------ */}
            <section id="gallery" className="bg-surface-muted py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow={t('home.gallery.eyebrow')}
                        title={t('home.gallery.title')}
                        description={t('home.gallery.description')}
                        action={{ label: t('buttons.viewFullGallery'), href: "/gallery" }}
                    />
                    <HomeDeferredSection data="galleryPreview" columns={6}>
                    <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
                        {(galleryPreview ?? []).map((item) => (
                            <RevealItem key={item.id} className="h-full">
                                <figure className="group relative aspect-square w-full overflow-hidden rounded-xl bg-surface">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        width={400}
                                        height={400}
                                        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white line-clamp-2">
                                        {item.caption}
                                    </figcaption>
                                </figure>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                    </HomeDeferredSection>
                </div>
                </FadeIn>
            </section>

            {/* Traveler Testimonials ------------------------------------------------- */}
            <section id="testimonials" className="bg-surface-muted py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow={t('home.testimonials.eyebrow')}
                        title={t('home.testimonials.title')}
                        description={t('home.testimonials.description')}
                        center
                    />
                    <HomeDeferredSection data="testimonials" columns={1}>
                        <DeferredTestimonialsCarousel items={testimonials ?? []} />
                    </HomeDeferredSection>
                </div>
                </FadeIn>
            </section>

            {/* Latest Articles -------------------------------------------------------- */}
            <section id="articles" className="bg-surface-muted py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow={t('home.articles.eyebrow')}
                        title={t('home.articles.title')}
                        description={t('home.articles.description')}
                        action={{
                            label: t('buttons.readAllArticles'),
                            href: "/articles",
                        }}
                    />
                    <HomeDeferredSection data="latestArticles" columns={3}>
                    <RevealStagger className="mt-10 grid gap-6 md:grid-cols-3">
                        {(latestArticles ?? []).map((article) => (
                            <RevealItem key={article.slug} className="h-full">
                                <Card>
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            width={800}
                                            height={500}
                                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-secondary/15 text-secondary">
                                                {article.category}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                {article.date}
                                            </p>
                                        </div>
                                        <h3 className={`mt-4 font-heading text-lg font-semibold text-foreground ${cardTitleClass}`}>
                                            {article.title}
                                        </h3>
                                        <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                                            {article.summary}
                                        </p>
                                        <Link
                                            href={articleShowHref(article.slug)}
                                            className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            {t('buttons.readArticle')}
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden
                                            />
                                        </Link>
                                    </div>
                                </Card>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                    </HomeDeferredSection>
                </div>
                </FadeIn>
            </section>

            {/* FAQ Preview ------------------------------------------------------------ */}
            <section id="faq" className="bg-background py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-3xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow={t('home.faq.eyebrow')}
                        title={t('home.faq.title')}
                        description={t('home.faq.description')}
                        center
                    />
                    <HomeDeferredSection data="faqItems" columns={1}>
                        <RevealStagger className="mt-10 space-y-3" stagger={0.06}>
                            {(faqItems ?? []).map((faq) => (
                                <RevealItem key={faq.id}>
                                    <details className="group rounded-2xl border border-border bg-surface shadow-sm open:bg-surface-muted">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-start font-heading text-base font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                                            {faq.question}
                                            <ArrowRight
                                                className="size-4 shrink-0 text-secondary transition-transform group-open:rotate-90"
                                                aria-hidden
                                            />
                                        </summary>
                                        <div className="px-6 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground">
                                            {faq.answer}
                                        </div>
                                    </details>
                                </RevealItem>
                            ))}
                        </RevealStagger>
                    </HomeDeferredSection>
                </div>
                </FadeIn>
            </section>
        </>
    );
}
