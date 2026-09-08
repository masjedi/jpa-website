import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { destinationToFormValues, type DestinationFormStatus } from '@/components/admin/destinationForm';
import { isRichTextHtml, normalizeRichHtml } from '@/lib/richText';
import { primaryTranslation } from '@/lib/translations';
import type { AdminDestination } from '@/types/destinations';

export type ManagedDestination = AdminDestination & {
    linkedTours?: readonly { id: string; title: string; meta: string }[];
};

interface BuildDestinationViewModelOptions {
    destination: ManagedDestination;
    status: ContentRecordStatus;
}

export function buildDestinationViewModel({
    destination,
    status,
}: BuildDestinationViewModelOptions): ContentRecordViewModel {
    const name = primaryTranslation(destination.name);
    const tagline = primaryTranslation(destination.tagline);
    const badge = primaryTranslation(destination.badge);
    const descriptionHtml = normalizeRichHtml(primaryTranslation(destination.description));
    const usesRichDescription = isRichTextHtml(descriptionHtml);
    const linkedTours = destination.linkedTours ?? [];

    return {
        title: name,
        subtitle: tagline,
        imageUrl: destination.image,
        imageAlt: name,
        badgeLabel: destination.region,
        status,
        cardEyebrow: badge || destination.region,
        cardCtaLabel: 'View destination',
        metaFields: [
            { id: 'region', label: 'Region', value: destination.region },
            { id: 'slug', label: 'Slug', value: destination.slug },
            { id: 'season', label: 'Best season', value: primaryTranslation(destination.bestSeason) || '—' },
            { id: 'style', label: 'Travel style', value: primaryTranslation(destination.travelStyle) || '—' },
            {
                id: 'featured',
                label: 'Featured',
                value: destination.isFeatured ? 'Yes' : 'No',
            },
            { id: 'status', label: 'Status', value: status },
            {
                id: 'tours',
                label: 'Linked tours',
                value: String(destination.linkedToursCount ?? linkedTours.length),
            },
        ],
        bodyHtml: usesRichDescription ? descriptionHtml : undefined,
        bodyPlain: usesRichDescription ? undefined : descriptionHtml,
        highlights:
            destination.highlights.length > 0 ? [...destination.highlights] : undefined,
        relatedItems:
            linkedTours.length > 0
                ? linkedTours.map((tour) => ({
                      id: tour.id,
                      title: tour.title,
                      meta: tour.meta,
                  }))
                : undefined,
        relatedItemsTitle: 'Tours that visit here',
    };
}

export function managedDestinationToFormValues(destination: ManagedDestination) {
    return destinationToFormValues(destination, destination.status);
}
