import {
    listingTypeLabel,
    packageToFormValues,
    resolveTourContent,
    type TourFormStatus,
    tourToFormValues,
} from '@/components/admin/tourForm';
import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { isRichTextHtml } from '@/lib/richText';
import type { Tour, TourPackage } from '@/types/tours';

interface BuildTourViewModelOptions {
    tour: Tour;
    status: ContentRecordStatus;
}

interface BuildPackageViewModelOptions {
    pkg: TourPackage;
    status: ContentRecordStatus;
}

export function buildTourViewModel({
    tour,
    status,
}: BuildTourViewModelOptions): ContentRecordViewModel {
    const content = resolveTourContent(tour);
    const usesRichContent = isRichTextHtml(content);

    return {
        title: tour.title,
        subtitle: tour.description,
        imageUrl: tour.image,
        imageAlt: tour.title,
        badgeLabel: listingTypeLabel('tour'),
        status,
        cardEyebrow: tour.region,
        cardCtaLabel: 'View',
        metaFields: [
            { id: 'type', label: 'Listing type', value: 'Tour itinerary' },
            { id: 'region', label: 'Region', value: tour.region },
            { id: 'destination', label: 'Destination', value: tour.destination },
            { id: 'slug', label: 'Slug', value: tour.slug },
            { id: 'duration', label: 'Duration', value: tour.duration },
            { id: 'style', label: 'Travel style', value: tour.travelStyle },
            { id: 'difficulty', label: 'Difficulty', value: tour.difficulty },
            {
                id: 'departure',
                label: 'Next departure',
                value: `${tour.nextDeparture.date} · ${tour.nextDeparture.status}`,
            },
            { id: 'price', label: 'Starting price', value: tour.estimatedStartingPrice },
            { id: 'status', label: 'Status', value: status },
        ],
        bodyHtml: usesRichContent ? content : undefined,
        bodyPlain: usesRichContent ? undefined : tour.description,
        highlights: usesRichContent ? undefined : [...tour.highlights],
        relatedItems:
            tour.itineraryOverview.length > 0 && !usesRichContent
                ? tour.itineraryOverview.slice(0, 4).map((day) => ({
                      id: `${tour.id}-${day.day}`,
                      title: `${day.day}: ${day.title}`,
                      meta: day.summary,
                  }))
                : undefined,
        relatedItemsTitle: usesRichContent ? undefined : 'Itinerary preview',
    };
}

export function buildPackageViewModel({
    pkg,
    status,
}: BuildPackageViewModelOptions): ContentRecordViewModel {
    return {
        title: pkg.title,
        subtitle: pkg.tagline,
        imageUrl: pkg.image,
        imageAlt: pkg.title,
        badgeLabel: listingTypeLabel('package'),
        status,
        cardEyebrow: pkg.badge,
        cardCtaLabel: 'View',
        metaFields: [
            { id: 'type', label: 'Listing type', value: 'Travel package' },
            { id: 'tagline', label: 'Tagline', value: pkg.tagline },
            { id: 'slug', label: 'Slug', value: pkg.slug },
            { id: 'duration', label: 'Duration', value: pkg.duration },
            { id: 'price', label: 'Price estimate', value: pkg.priceEstimate },
            { id: 'idealFor', label: 'Ideal for', value: pkg.idealFor },
            {
                id: 'popular',
                label: 'Featured',
                value: pkg.isPopular ? 'Popular package' : 'Standard',
            },
            { id: 'status', label: 'Status', value: status },
        ],
        bodyPlain: pkg.description,
        highlights: [...pkg.featuredPerks],
        relatedItems: pkg.keyDestinations.slice(0, 4).map((destination) => ({
            id: `${pkg.id}-${destination}`,
            title: destination,
            meta: 'Key destination',
        })),
        relatedItemsTitle: 'Key destinations',
    };
}

export type ManagedOffer =
    | ({ listingType: 'tour'; status: TourFormStatus } & Tour)
    | ({ listingType: 'package'; status: TourFormStatus } & TourPackage);

export function offerToFormValues(offer: ManagedOffer): ReturnType<typeof tourToFormValues> {
    return offer.listingType === 'package'
        ? packageToFormValues(offer, offer.status)
        : tourToFormValues(offer, offer.status);
}

export function buildOfferViewModel(offer: ManagedOffer): ContentRecordViewModel {
    return offer.listingType === 'package'
        ? buildPackageViewModel({ pkg: offer, status: offer.status })
        : buildTourViewModel({ tour: offer, status: offer.status });
}
