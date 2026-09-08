import {
    listingTypeLabel,
    tourOfferToFormValues,
    type TourFormStatus,
} from '@/components/admin/tourForm';
import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { isRichTextHtml, normalizeRichHtml } from '@/lib/richText';
import { createEmptyTranslatedString, primaryTranslation } from '@/lib/translations';
import type { AdminTourOffer } from '@/types/tours';

export type ManagedOffer = AdminTourOffer;

export function offerToFormValues(offer: ManagedOffer) {
    return tourOfferToFormValues(offer);
}

export function buildOfferViewModel(offer: ManagedOffer): ContentRecordViewModel {
    const title = primaryTranslation(offer.title);
    const summary = primaryTranslation(offer.description);
    const content = normalizeRichHtml(primaryTranslation(offer.content ?? createEmptyTranslatedString()));
    const usesRichContent = offer.listingType === 'tour' && isRichTextHtml(content);

    if (offer.listingType === 'package') {
        return {
            title,
            subtitle: primaryTranslation(offer.tagline ?? createEmptyTranslatedString()),
            imageUrl: offer.image,
            imageAlt: title,
            badgeLabel: listingTypeLabel('package'),
            status: offer.status,
            cardEyebrow: primaryTranslation(offer.badge),
            cardCtaLabel: 'View',
            metaFields: [
                { id: 'type', label: 'Listing type', value: 'Travel package' },
                {
                    id: 'tagline',
                    label: 'Tagline',
                    value: primaryTranslation(offer.tagline ?? createEmptyTranslatedString()),
                },
                { id: 'slug', label: 'Slug', value: offer.slug },
                {
                    id: 'duration',
                    label: 'Duration',
                    value: primaryTranslation(offer.duration),
                },
                {
                    id: 'price',
                    label: 'Price estimate',
                    value: primaryTranslation(offer.priceEstimate ?? createEmptyTranslatedString()),
                },
                {
                    id: 'idealFor',
                    label: 'Ideal for',
                    value: primaryTranslation(offer.idealFor ?? createEmptyTranslatedString()),
                },
                {
                    id: 'popular',
                    label: 'Featured',
                    value: offer.isPopular ? 'Popular package' : 'Standard',
                },
                { id: 'status', label: 'Status', value: offer.status },
            ],
            bodyPlain: summary,
            highlights: [...(offer.highlights ?? [])],
            relatedItems: (offer.keyDestinations ?? []).slice(0, 4).map((destination) => ({
                id: `${offer.id}-${destination}`,
                title: destination,
                meta: 'Key destination',
            })),
            relatedItemsTitle: 'Key destinations',
        };
    }

    return {
        title,
        subtitle: summary,
        imageUrl: offer.image,
        imageAlt: title,
        badgeLabel: listingTypeLabel('tour'),
        status: offer.status,
        cardEyebrow: offer.region,
        cardCtaLabel: 'View',
        metaFields: [
            { id: 'type', label: 'Listing type', value: 'Tour itinerary' },
            { id: 'region', label: 'Region', value: offer.region },
            {
                id: 'destination',
                label: 'Destination',
                value: primaryTranslation(offer.destination),
            },
            { id: 'slug', label: 'Slug', value: offer.slug },
            {
                id: 'duration',
                label: 'Duration',
                value: primaryTranslation(offer.duration),
            },
            { id: 'style', label: 'Travel style', value: offer.travelStyle ?? '—' },
            { id: 'difficulty', label: 'Difficulty', value: offer.difficulty ?? '—' },
            { id: 'status', label: 'Status', value: offer.status },
        ],
        bodyHtml: usesRichContent ? content : undefined,
        bodyPlain: usesRichContent ? undefined : summary,
        highlights: usesRichContent ? undefined : [...(offer.highlights ?? [])],
        relatedItemsTitle: usesRichContent ? undefined : 'Highlights preview',
    };
}
