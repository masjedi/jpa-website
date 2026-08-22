import type { PackageJourneyPhase } from '@/types/tours';

export type TravelOfferKind = 'tour' | 'package';

export interface TravelOfferRelatedItem {
    slug: string;
    title: string;
    tagline: string;
    image: string;
    durationDays: number;
    durationLabel: string;
    badge?: string;
    priceLabel: string;
    href: string;
}

export interface TravelOfferDetail {
    kind: TravelOfferKind;
    slug: string;
    title: string;
    tagline: string;
    image: string;
    durationDays: number;
    durationLabel: string;
    badge?: string;
    priceLabel: string;
    description: string;
    content?: string;
    highlights: readonly string[];
    journeyOutline?: readonly PackageJourneyPhase[];
    destinations: readonly string[];
    sidebarIdealFor: string;
    inclusions: readonly string[];
    breadcrumbs: {
        listLabel: string;
        listHref: string;
    };
    labels: {
        request: string;
        back: string;
        about: string;
        highlights: string;
        relatedEyebrow: string;
        relatedTitle: string;
        relatedViewAll: string;
    };
    relatedItems: readonly TravelOfferRelatedItem[];
    inquiryPreferredDate?: string;
}
