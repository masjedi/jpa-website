import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    BedDouble,
    Bus,
    Camera,
    Compass,
    FileText,
    MapPin,
    MapPinned,
    MessageCircle,
    Mountain,
    Route,
    ShieldCheck,
    UserCheck,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";

import type { PublicFaqItem } from '@/types/faq';
import type { PublicTestimonial } from '@/types/testimonials';
import { SpotlightCard } from "@/components/react-bits/SpotlightCard/SpotlightCard";
import { FadeIn, FadeInOnMount, RevealItem, RevealStagger } from "@/components/motion/FadeIn";
import { destinationShowHref, articleShowHref } from "@/components/public/navigation";
import { DonateButton } from "@/components/public/DonateButton";
import { HomeDeferredSection } from '@/components/loading/HomeDeferredSection';
import { DeferredTestimonialsCarousel } from '@/components/sections/home/HomeDeferredSections';
import { HeroScannerBackground } from "@/components/sections/home/HeroScannerBackground";
import type { ArticleListItem } from '@/types/articles';
import type { Destination } from '@/types/destinations';
import type { GalleryPhoto } from '@/types/gallery';
import type { PublicHeroSlide, PublicHeroSection } from '@/types/heroSection';
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

interface Service {
    icon: LucideIcon;
    title: string;
    description: string;
}

/* Finder options ----------------------------------------------------------- */

const destinationOptions: readonly FinderOption[] = [
    { value: "all", label: "All destinations" },
    { value: "kabul", label: "Kabul & around" },
    { value: "bamiyan", label: "Bamiyan Valley" },
    { value: "herat", label: "Herat" },
    { value: "panjshir", label: "Panjshir Valley" },
];

const travelStyleOptions: readonly FinderOption[] = [
    { value: "any", label: "Any travel style" },
    { value: "cultural", label: "Cultural & heritage" },
    { value: "adventure", label: "Adventure & trekking" },
    { value: "photography", label: "Photography focus" },
    { value: "family", label: "Family friendly" },
];

const seasonOptions: readonly FinderOption[] = [
    { value: "any", label: "Any season" },
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" },
];

const groupTypeOptions: readonly FinderOption[] = [
    { value: "any", label: "Any group type" },
    { value: "private", label: "Private tour" },
    { value: "small-group", label: "Small group" },
    { value: "solo", label: "Solo traveler" },
];

/* Trust indicators --------------------------------------------------------- */

const trustIndicators: readonly TrustIndicator[] = [
    {
        icon: MapPinned,
        title: "Local expertise",
        description:
            "Experienced Afghan guides who know the routes, culture and practical realities of travel here.",
    },
    {
        icon: Compass,
        title: "Tailored planning",
        description:
            "Every journey is shaped around your interests, pace and travel style — not a fixed template.",
    },
    {
        icon: ShieldCheck,
        title: "Responsible tourism",
        description:
            "We prioritise respectful engagement, clear communication and community-minded tourism.",
    },
    {
        icon: MessageCircle,
        title: "Human support",
        description:
            "Real people review every inquiry and stay available before and during your journey.",
    },
] as const;

/* Services ------------------------------------------------------------------ */

const servicesOverview: readonly Service[] = [
    {
        icon: Users,
        title: "Guided tours",
        description:
            "Scheduled small-group journeys led by experienced local guides.",
    },
    {
        icon: UserCheck,
        title: "Private tours",
        description:
            "Flexible travel with your own guide and vehicle, at your own pace.",
    },
    {
        icon: Route,
        title: "Custom itineraries",
        description:
            "Bespoke routes designed around your dates, interests and travel style.",
    },
    {
        icon: MapPinned,
        title: "Local guides",
        description:
            "Certified Afghan guides for day trips, city walks and specialist visits.",
    },
    {
        icon: Bus,
        title: "Transportation coordination",
        description:
            "Reliable vehicles and drivers matched to your route and group size.",
    },
    {
        icon: BedDouble,
        title: "Accommodation coordination",
        description:
            "Guesthouses and hotels selected for comfort, location and character.",
    },
];

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
            className={`overflow-hidden rounded-2xl border border-border bg-surface shadow-sm ${className}`}
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

/* Hero carousel ------------------------------------------------------------- */

function HeroMessageCarousel({ slides }: { slides: readonly PublicHeroSlide[] }) {
    const reducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (slides.length === 0) {
            return;
        }

        if (activeIndex >= slides.length) {
            setActiveIndex(0);
        }
    }, [activeIndex, slides.length]);

    useEffect(() => {
        if (reducedMotion || isPaused || slides.length <= 1) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 6000);

        return () => window.clearInterval(interval);
    }, [isPaused, reducedMotion, slides.length]);

    if (slides.length === 0) {
        return null;
    }

    const activeMessage = slides[activeIndex];

    return (
        <div
            aria-label="Featured travel messages"
            aria-roledescription="carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
        >
            <div className="grid min-h-[13.5rem] place-items-center sm:min-h-[14rem]">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={activeIndex}
                        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                        <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.15] text-brand-on-surface sm:text-5xl lg:text-[3.25rem]">
                            {activeMessage.title}
                        </h1>
                        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-on-surface/75 sm:text-lg">
                            {activeMessage.subtitle}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2" aria-label="Choose a message">
                {slides.map((message, index) => (
                    <button
                        key={message.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show message ${index + 1} of ${slides.length}`}
                        aria-current={index === activeIndex ? "true" : undefined}
                        className={`h-1.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus ${
                            index === activeIndex
                                ? "w-8 bg-accent"
                                : "w-3 bg-brand-on-surface/35 hover:bg-brand-on-surface/60"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Home landing                                                               */
/* -------------------------------------------------------------------------- */

export function HomeLanding({
    hero,
    featuredTours,
    featuredDestinations,
    galleryPreview,
    latestArticles,
    faqItems,
    testimonials,
}: {
    hero: PublicHeroSection;
    featuredTours?: readonly Tour[];
    featuredDestinations?: readonly Destination[];
    galleryPreview?: readonly GalleryPhoto[];
    latestArticles?: readonly ArticleListItem[];
    faqItems?: readonly PublicFaqItem[];
    testimonials?: readonly PublicTestimonial[];
}) {
    return (
        <>
            {/* Hero ---------------------------------------------------------- */}
            <section
                id="hero"
                className="relative isolate grid min-h-screen w-full place-items-center overflow-hidden bg-brand-deep"
            >
                <div aria-hidden className="absolute inset-0">
                    <HeroScannerBackground />
                </div>

                <FadeInOnMount className="relative z-10 max-w-3xl px-4 py-28 text-center sm:px-6 lg:py-32">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-on-surface/65">
                        {hero.eyebrow}
                    </p>
                    {hero.slides.length > 0 ? (
                        <HeroMessageCarousel slides={hero.slides} />
                    ) : (
                        <div className="mt-5 grid min-h-[13.5rem] place-items-center sm:min-h-[14rem]">
                            <p className="max-w-lg text-base leading-relaxed text-brand-on-surface/75 sm:text-lg">
                                Publish a hero slide in the admin dashboard to show your headline here.
                            </p>
                        </div>
                    )}

                    <div className="mt-7 flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <a
                                href="#tours"
                                className="inline-flex min-w-[9.5rem] items-center justify-center rounded-full border border-brand-on-surface/25 px-6 py-2.5 text-sm font-medium text-brand-on-surface transition-colors hover:border-brand-on-surface/45 hover:bg-brand-on-surface/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Explore Tours
                            </a>
                            <Link
                                id="plan-trip"
                                href="/contact"
                                className="inline-flex min-w-[9.5rem] items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Send your Inquiry
                            </Link>
                        </div>
                        <DonateButton variant="hero" />
                    </div>
                </FadeInOnMount>
            </section>

            {/* Quick Tour Finder --------------------------------------------- */}
            <section
                id="booking"
                className="border-b border-border bg-background py-12 sm:py-16"
            >
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    Destination
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label="Destination"
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
                                    Travel style
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label="Travel style"
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
                                    Preferred season
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label="Preferred season"
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
                                    Group type
                                </span>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    aria-label="Group type"
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
                                    Find Tours
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
                                    <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                                        {point.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                        eyebrow="Featured tours"
                        title="Journeys we love to guide"
                        description="A few of our most requested routes, each built around local insight and flexible pacing."
                        action={{ label: "View all tours", href: "/tours" }}
                    />
                    <HomeDeferredSection data="featuredTours" columns={3}>
                    <RevealStagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {(featuredTours ?? []).map((tour) => (
                            <RevealItem key={tour.slug}>
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
                                    <div className="p-6 text-start">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className="bg-secondary/15 text-secondary">
                                                {tour.travelStyle}
                                            </Badge>
                                            <Badge className="bg-surface-muted text-muted-foreground">
                                                {tour.difficulty}
                                            </Badge>
                                        </div>
                                        <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                                            {tour.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {tour.destination} · {tour.duration}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                            {tour.description}
                                        </p>
                                        <div className="mt-5 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-foreground">
                                                Price on Request
                                            </p>
                                            <a
                                                href="#contact"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                            >
                                                Request This Tour
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
                        eyebrow="Destinations"
                        title="Where we can take you"
                        description="From high-altitude lakes to ancient cities, each destination offers a different side of Afghanistan."
                        action={{
                            label: "Explore all destinations",
                            href: "/destinations",
                        }}
                    />
                    <HomeDeferredSection data="featuredDestinations" columns={4}>
                    <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {(featuredDestinations ?? []).map((destination) => (
                            <RevealItem key={destination.slug}>
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
                                    <div className="p-5 text-start">
                                        <h3 className="font-heading text-lg font-semibold text-foreground">
                                            {destination.name}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {destination.tagline}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                {destination.linkedToursCount ?? 0}{" "}
                                                related tour
                                                {(destination.linkedToursCount ?? 0) === 1
                                                    ? ""
                                                    : "s"}
                                            </p>
                                            <Link
                                                href={destinationShowHref(destination.slug)}
                                                className="text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                            >
                                                Explore
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

            {/* Services Overview --------------------------------------------------- */}
            <section id="services" className="bg-surface-muted py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Services"
                        title="How we support your journey"
                        description="From a single day with a local guide to a fully custom itinerary, we coordinate the practical details so you can focus on the experience."
                        action={{
                            label: "See all services",
                            href: "/services",
                        }}
                    />
                    <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {servicesOverview.map((service) => (
                            <RevealItem key={service.title}>
                                <Card className="p-6 text-start">
                                    <service.icon
                                        className="size-6 text-secondary"
                                        aria-hidden
                                    />
                                    <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                                        {service.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {service.description}
                                    </p>
                                </Card>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                </div>
                </FadeIn>
            </section>

            {/* Gallery Preview ------------------------------------------------------ */}
            <section id="gallery" className="bg-surface-muted py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Gallery"
                        title="Moments from the road"
                        description="A glimpse of the landscapes, cities and everyday life our travellers experience."
                        action={{ label: "View full gallery", href: "/gallery" }}
                    />
                    <HomeDeferredSection data="galleryPreview" columns={6}>
                    <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
                        {(galleryPreview ?? []).map((item) => (
                            <RevealItem key={item.id}>
                                <figure className="group relative overflow-hidden rounded-xl">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        width={400}
                                        height={400}
                                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white">
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
            <section id="testimonials" className="bg-background py-16 sm:py-20">
                <FadeIn>
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Testimonials"
                        title="What travellers say"
                        description="Real feedback from guests who explored Afghanistan with our team."
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
                        eyebrow="Travel blog"
                        title="Latest articles & guides"
                        description="Practical advice, cultural insight and itinerary ideas from our team."
                        action={{
                            label: "Read all articles",
                            href: "/articles",
                        }}
                    />
                    <HomeDeferredSection data="latestArticles" columns={3}>
                    <RevealStagger className="mt-10 grid gap-6 md:grid-cols-3">
                        {(latestArticles ?? []).map((article) => (
                            <RevealItem key={article.slug}>
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
                                    <div className="p-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-secondary/15 text-secondary">
                                                {article.category}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                {article.date}
                                            </p>
                                        </div>
                                        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                                            {article.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {article.summary}
                                        </p>
                                        <Link
                                            href={articleShowHref(article.slug)}
                                            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            Read Article
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
                        eyebrow="Travel information"
                        title="Frequently asked questions"
                        description="Quick answers to common questions about planning a trip to Afghanistan."
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
