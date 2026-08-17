import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    BedDouble,
    Bus,
    CalendarDays,
    Camera,
    Compass,
    FileText,
    HandHeart,
    Handshake,
    Heart,
    Mail,
    MapPin,
    MapPinned,
    MessageCircle,
    Mountain,
    Quote,
    Route,
    ShieldCheck,
    Star,
    Tent,
    UserCheck,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";

import { BorderGlow } from "@/components/react-bits/BorderGlow/BorderGlow";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard/SpotlightCard";
import { HeroScannerBackground } from "@/components/sections/home/HeroScannerBackground";

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                  */
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

interface Tour {
    image: string;
    title: string;
    destination: string;
    duration: string;
    difficulty: string;
    travelStyle: string;
    description: string;
    action: string;
}

interface Destination {
    image: string;
    name: string;
    description: string;
    relatedTours: number;
}

interface Service {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface ImpactPoint {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface GalleryItem {
    image: string;
    alt: string;
    caption: string;
}

interface Testimonial {
    name: string;
    journey: string;
    text: string;
    rating: number;
}

interface Article {
    image: string;
    category: string;
    title: string;
    summary: string;
    date: string;
}

interface Faq {
    question: string;
    answer: string;
}

type DepartureStatus = "Available" | "Limited Availability" | "On Request";

interface Departure {
    title: string;
    date: string;
    duration: string;
    travelType: string;
    status: DepartureStatus;
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

/* Tours -------------------------------------------------------------------- */

const featuredTours: readonly Tour[] = [
    {
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
        title: "Bamiyan Heritage Circuit",
        destination: "Bamiyan Valley",
        duration: "7 days",
        difficulty: "Moderate",
        travelStyle: "Cultural & heritage",
        description:
            "Ancient cliff monasteries, Band-e Amir’s turquoise lakes and village hospitality in the heart of the Hazarajat.",
        action: "Request This Tour",
    },
    {
        image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=900&q=80",
        title: "Kabul & Panjshir Discovery",
        destination: "Kabul / Panjshir",
        duration: "5 days",
        difficulty: "Easy",
        travelStyle: "Culture & photography",
        description:
            "Old-city bazaars, the Gardens of Babur and a day in the dramatic Panjshir gorge with a local driver-guide.",
        action: "Request This Tour",
    },
    {
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
        title: "Herat Art & Architecture",
        destination: "Herat",
        duration: "4 days",
        difficulty: "Easy",
        travelStyle: "Cultural & heritage",
        description:
            "Timurid tilework, the Great Mosque and traditional craft workshops with a specialist cultural guide.",
        action: "Request This Tour",
    },
];

/* Destinations ------------------------------------------------------------- */

const featuredDestinations: readonly Destination[] = [
    {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
        name: "Bamiyan Valley",
        description:
            "High-altitude lakes, cliff monasteries and star-filled nights in the central highlands.",
        relatedTours: 3,
    },
    {
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
        name: "Panjshir Valley",
        description:
            "Dramatic gorges, riverside picnics and day hikes within reach of Kabul.",
        relatedTours: 2,
    },
    {
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
        name: "Herat",
        description:
            "Persian-influenced art, architecture and one of the oldest living bazaars in the region.",
        relatedTours: 2,
    },
    {
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",
        name: "Kabul",
        description:
            "Museums, gardens, hillside views and the everyday rhythm of the capital.",
        relatedTours: 4,
    },
];

/* Why travel with us -------------------------------------------------------- */

const whyTravelWithUs = [
    {
        icon: MapPinned,
        title: "Local knowledge",
        description:
            "Routes, cultural context and practical insight from guides who live and work in Afghanistan.",
    },
    {
        icon: Compass,
        title: "Personal planning",
        description:
            "Itineraries built around your interests, not copied from a fixed template.",
    },
    {
        icon: MessageCircle,
        title: "Clear communication",
        description:
            "Transparent answers about itineraries, logistics and what to expect before you travel.",
    },
    {
        icon: ShieldCheck,
        title: "Responsible travel",
        description:
            "Respectful engagement with communities and attention to local customs and environment.",
    },
] as const;

/* Departures ---------------------------------------------------------------- */

const upcomingDepartures: readonly Departure[] = [
    {
        title: "Bamiyan Heritage Circuit",
        date: "14 Apr 2026",
        duration: "7 days",
        travelType: "Small group",
        status: "Available",
    },
    {
        title: "Kabul & Panjshir Discovery",
        date: "28 Apr 2026",
        duration: "5 days",
        travelType: "Private tour",
        status: "On Request",
    },
    {
        title: "Herat Art & Architecture",
        date: "12 May 2026",
        duration: "4 days",
        travelType: "Small group",
        status: "Limited Availability",
    },
];

const statusStyles: Record<DepartureStatus, string> = {
    Available:
        "bg-secondary/15 text-secondary dark:bg-secondary/25 dark:text-secondary",
    "Limited Availability":
        "bg-accent/15 text-accent-foreground dark:bg-accent/25 dark:text-accent",
    "On Request":
        "bg-surface-muted text-muted-foreground dark:bg-white/10 dark:text-muted-foreground",
};

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

/* Impact -------------------------------------------------------------------- */

const impactPoints: readonly ImpactPoint[] = [
    {
        icon: HandHeart,
        title: "Locally owned services",
        description:
            "We work with Afghan-owned guesthouses, drivers and artisans so tourism income stays local.",
    },
    {
        icon: ShieldCheck,
        title: "Cultural respect",
        description:
            "Guides share context on customs, dress and etiquette so visits are welcomed by hosts.",
    },
    {
        icon: Heart,
        title: "Community-minded travel",
        description:
            "Small groups and fair pricing that respect the people and places we visit.",
    },
    {
        icon: Tent,
        title: "Responsible visitor behavior",
        description:
            "Leave-no-trace practices, photography consent and support for conservation efforts.",
    },
];

/* Gallery ------------------------------------------------------------------- */

const galleryItems: readonly GalleryItem[] = [
    {
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        alt: "Band-e Amir lakes at sunset, Bamiyan",
        caption: "Band-e Amir, Bamiyan",
    },
    {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        alt: "Mountain pass in the Hindu Kush",
        caption: "Hindu Kush",
    },
    {
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
        alt: "Historic minarets of Herat",
        caption: "Herat",
    },
    {
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        alt: "Kabul hillside homes at dusk",
        caption: "Kabul",
    },
    {
        image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80",
        alt: "Panjshir River valley",
        caption: "Panjshir Valley",
    },
    {
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
        alt: "Afghan bread baking in a clay oven",
        caption: "Local bakery",
    },
];

/* Testimonials -------------------------------------------------------------- */

const testimonials: readonly Testimonial[] = [
    {
        name: "Elena M.",
        journey: "Bamiyan Heritage Circuit, 2025",
        text: "The guide’s knowledge turned every site into a story. Logistics were seamless and the lakes were unforgettable.",
        rating: 5,
    },
    {
        name: "Marcus T.",
        journey: "Kabul & Panjshir Discovery, 2025",
        text: "Responsive planning, honest advice and a driver who felt like a friend. A trip I would happily repeat.",
        rating: 5,
    },
    {
        name: "Ayesha K.",
        journey: "Herat Art & Architecture, 2024",
        text: "Small group, thoughtful pacing and deep respect for local culture. I felt looked after from start to finish.",
        rating: 4,
    },
];

/* Articles ------------------------------------------------------------------- */

const latestArticles: readonly Article[] = [
    {
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        category: "Travel tips",
        title: "What to pack for spring in Afghanistan",
        summary:
            "Layering, footwear and small essentials for variable mountain weather.",
        date: "12 Mar 2026",
    },
    {
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
        category: "Culture",
        title: "A respectful traveller’s guide to Herat",
        summary:
            "Etiquette, photography consent and how to support local artisans.",
        date: "28 Feb 2026",
    },
    {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        category: "Itineraries",
        title: "One week in Bamiyan: a practical route",
        summary:
            "How to structure days between the lakes, the cliffs and village homestays.",
        date: "15 Feb 2026",
    },
];

/* FAQ ------------------------------------------------------------------------ */

const faqItems: readonly Faq[] = [
    {
        question: "Do I need a visa to visit Afghanistan?",
        answer: "Most nationalities require a visa in advance. We can outline the general process, but requirements change often — always confirm with the nearest Afghan embassy before booking.",
    },
    {
        question: "What should I wear while travelling?",
        answer: "Modest, loose-fitting clothing is appropriate for most places. Women should carry a headscarf for religious sites. We share detailed guidance with every confirmed itinerary.",
    },
    {
        question: "Will I have mobile connectivity?",
        answer: "Major cities have reliable mobile data; remote valleys can be limited. We help you choose a local SIM and plan offline maps where needed.",
    },
    {
        question: "How should I behave around local customs?",
        answer: "A respectful, observant approach goes a long way. Ask before photographing people, accept hospitality graciously, and follow your guide’s lead in religious or community settings.",
    },
    {
        question: "Do I need travel insurance?",
        answer: "Comprehensive travel insurance that covers your planned activities is strongly recommended. Check that your policy is valid for Afghanistan before departure.",
    },
    {
        question: "How does the booking inquiry work?",
        answer: "Send us your dates, interests and group size. We review availability manually and reply with a tailored quotation. Submitting an inquiry does not reserve a seat or confirm a trip.",
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

/* -------------------------------------------------------------------------- */
/*  Home landing                                                               */
/* -------------------------------------------------------------------------- */

export function HomeLanding() {
    return (
        <>
            {/* Hero ---------------------------------------------------------- */}
            <section
                id="hero"
                className="relative isolate grid min-h-screen w-full place-items-center overflow-hidden bg-brand-surface"
            >
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <HeroScannerBackground />
                </div>

                <div className="relative z-10 max-w-3xl px-4 py-28 text-center sm:px-6 lg:py-32">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-on-surface/65">
                        Premium guided travel in Afghanistan
                    </p>
                    <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.15] text-brand-on-surface sm:text-5xl lg:text-[3.25rem]">
                        Discover Afghanistan with trusted local guidance
                    </h1>
                    <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-on-surface/75 sm:text-lg">
                        Landscapes, heritage and hospitality — planned with
                        people who know the country deeply.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href="#tours"
                            className="inline-flex min-w-[9.5rem] items-center justify-center rounded-full border border-brand-on-surface/25 px-6 py-2.5 text-sm font-medium text-brand-on-surface transition-colors hover:border-brand-on-surface/45 hover:bg-brand-on-surface/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Explore Tours
                        </a>
                        <a
                            id="plan-trip"
                            href="#contact"
                            className="inline-flex min-w-[9.5rem] items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Plan My Trip
                        </a>
                    </div>
                </div>
            </section>

            {/* Quick Tour Finder --------------------------------------------- */}
            <section
                id="finder"
                className="border-b border-border bg-background py-12 sm:py-16"
            >
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
            </section>

            {/* Trust Indicators ------------------------------------------------ */}
            <section id="trust" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {trustIndicators.map((point) => (
                            <li key={point.title}>
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
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Featured Tours -------------------------------------------------- */}
            <section id="tours" className="bg-surface-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Featured tours"
                        title="Journeys we love to guide"
                        description="A few of our most requested routes, each built around local insight and flexible pacing."
                        action={{ label: "View all tours", href: "/tours" }}
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredTours.map((tour) => (
                            <div key={tour.title}>
                                <Card>
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={tour.image}
                                            alt={tour.title}
                                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
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
                                                {tour.action}
                                                <ArrowRight
                                                    className="size-4"
                                                    aria-hidden
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Destinations -------------------------------------------- */}
            <section id="destinations" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Destinations"
                        title="Where we can take you"
                        description="From high-altitude lakes to ancient cities, each destination offers a different side of Afghanistan."
                        action={{
                            label: "Explore all destinations",
                            href: "#destinations",
                        }}
                    />
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredDestinations.map((destination) => (
                            <div key={destination.name}>
                                <Card>
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-5 text-start">
                                        <h3 className="font-heading text-lg font-semibold text-foreground">
                                            {destination.name}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {destination.description}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                {destination.relatedTours}{" "}
                                                related tour
                                                {destination.relatedTours === 1
                                                    ? ""
                                                    : "s"}
                                            </p>
                                            <a
                                                href="#destinations"
                                                className="text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                            >
                                                Explore
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Travel With Us ------------------------------------------------ */}
            <section id="about" className="bg-surface-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Why travel with us"
                        title="Travel with clarity, care and cultural depth"
                        description="We help international visitors experience Afghanistan through thoughtfully guided tours, transparent planning and inquiry-based bookings reviewed by our team."
                    />
                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {whyTravelWithUs.map((point) => (
                            <BorderGlow
                                key={point.title}
                                className="h-full"
                                backgroundColor="var(--surface)"
                                borderRadius={16}
                                colors={["#0E7373", "#163B5C", "#D7A23A"]}
                                glowColor="182 78 26"
                                edgeSensitivity={28}
                                glowRadius={28}
                                glowIntensity={0.9}
                                coneSpread={22}
                                fillOpacity={0.35}
                            >
                                <div className="p-6 text-start">
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
                                </div>
                            </BorderGlow>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Departures ----------------------------------------------- */}
            <section id="departures" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Upcoming departures"
                        title="Scheduled small-group journeys"
                        description="Dates below are indicative. Our team reviews availability manually and confirms every booking by email."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {upcomingDepartures.map((departure) => (
                            <div key={`${departure.title}-${departure.date}`}>
                                <Card>
                                    <div className="p-6 text-start">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-heading text-lg font-semibold text-foreground">
                                                {departure.title}
                                            </h3>
                                            <Badge
                                                className={
                                                    statusStyles[
                                                        departure.status
                                                    ]
                                                }
                                            >
                                                {departure.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                            <p className="flex items-center gap-2">
                                                <CalendarDays
                                                    className="size-4 text-secondary"
                                                    aria-hidden
                                                />
                                                {departure.date}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Route
                                                    className="size-4 text-secondary"
                                                    aria-hidden
                                                />
                                                {departure.duration}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Users
                                                    className="size-4 text-secondary"
                                                    aria-hidden
                                                />
                                                {departure.travelType}
                                            </p>
                                        </div>
                                        <a
                                            href="#contact"
                                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            Request this date
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden
                                            />
                                        </a>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        Availability is manually reviewed. Submitting a request
                        does not reserve a seat or confirm a trip.
                    </p>
                </div>
            </section>

            {/* Services Overview --------------------------------------------------- */}
            <section id="services" className="bg-surface-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Services"
                        title="How we support your journey"
                        description="From a single day with a local guide to a fully custom itinerary, we coordinate the practical details so you can focus on the experience."
                        action={{
                            label: "See all services",
                            href: "#services",
                        }}
                    />
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {servicesOverview.map((service) => (
                            <div key={service.title}>
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cultural and Community Impact --------------------------------------- */}
            <section id="impact" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Cultural & community impact"
                        title="Travel that gives back"
                        description="We design journeys that respect local culture and keep tourism income within Afghan communities."
                        center
                    />
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {impactPoints.map((point) => (
                            <div
                                key={point.title}
                                className="rounded-2xl border border-border bg-surface p-6 text-start shadow-sm"
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Preview ------------------------------------------------------ */}
            <section id="gallery" className="bg-surface-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Gallery"
                        title="Moments from the road"
                        description="A glimpse of the landscapes, cities and everyday life our travellers experience."
                        action={{
                            label: "View full gallery",
                            href: "#gallery",
                        }}
                    />
                    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {galleryItems.map((item) => (
                            <div key={item.caption}>
                                <figure className="group relative overflow-hidden rounded-xl">
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white">
                                        {item.caption}
                                    </figcaption>
                                </figure>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Traveler Testimonials ------------------------------------------------- */}
            <section id="testimonials" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Testimonials"
                        title="What travellers say"
                        description="Real feedback from guests who explored Afghanistan with our team."
                        center
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.name}>
                                <Card className="p-6 text-start">
                                    <Quote
                                        className="size-6 text-secondary"
                                        aria-hidden
                                    />
                                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                        “{testimonial.text}”
                                    </p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div>
                                            <p className="font-heading text-sm font-semibold text-foreground">
                                                {testimonial.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {testimonial.journey}
                                            </p>
                                        </div>
                                        <div
                                            className="flex gap-0.5"
                                            aria-label={`${testimonial.rating} out of 5 stars`}
                                        >
                                            {Array.from(
                                                { length: 5 },
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`size-4 ${
                                                            i <
                                                            testimonial.rating
                                                                ? "fill-accent text-accent"
                                                                : "text-border"
                                                        }`}
                                                        aria-hidden
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Articles -------------------------------------------------------- */}
            <section id="articles" className="bg-surface-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Travel blog"
                        title="Latest articles & guides"
                        description="Practical advice, cultural insight and itinerary ideas from our team."
                        action={{
                            label: "Read all articles",
                            href: "#articles",
                        }}
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {latestArticles.map((article) => (
                            <div key={article.title}>
                                <Card>
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
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
                                        <a
                                            href="#articles"
                                            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            Read Article
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden
                                            />
                                        </a>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Preview ------------------------------------------------------------ */}
            <section id="faq" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 text-start sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Travel information"
                        title="Frequently asked questions"
                        description="Quick answers to common questions about planning a trip to Afghanistan."
                        center
                    />
                    <div className="mt-10 space-y-3">
                        {faqItems.map((faq) => (
                            <div key={faq.question}>
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Donation / Community Support CTA ----------------------------------------- */}
            <section id="donation" className="bg-surface-muted py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
                        <Handshake
                            className="mx-auto size-8 text-secondary"
                            aria-hidden
                        />
                        <h2 className="mt-4 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                            Support Afghan communities
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                            We connect travellers with verified local
                            initiatives that support education, cultural
                            preservation and small businesses. Donation details
                            are shared through secure, verified channels — we
                            never ask for bank or card details here.
                        </p>
                        <a
                            href="#donation"
                            className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Learn how to support
                        </a>
                    </div>
                </div>
            </section>

            {/* Newsletter Subscription ---------------------------------------------------- */}
            <section id="newsletter" className="bg-background py-16 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <Mail
                        className="mx-auto size-8 text-secondary"
                        aria-hidden
                    />
                    <h2 className="mt-4 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                        Travel notes & inspiration
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        Occasional updates on new itineraries, seasonal
                        highlights and practical travel advice.
                    </p>
                    <form
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="newsletter-email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            className="w-full flex-1 rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
