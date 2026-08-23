import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { destinationToFormValues, type DestinationFormStatus } from '@/components/admin/destinationForm';
import { isRichTextHtml, normalizeRichHtml } from '@/lib/richText';
import type { Destination } from '@/types/destinations';

export type ManagedDestination = {
    id: number;
    slug: string;
    status: DestinationFormStatus;
    name: string;
    tagline: string;
    region: Destination['region'];
    badge?: string;
    image: string;
    description: string;
    highlights: readonly string[];
    bestSeason: string;
    travelStyle: string;
    practicalNotes: readonly string[];
    tourMatchKeywords: readonly string[];
    isFeatured?: boolean;
    linkedToursCount?: number;
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
    const description = normalizeRichHtml(destination.description ?? '');
    const usesRichDescription = isRichTextHtml(description);
    const linkedTours = destination.linkedTours ?? [];

    return {
        title: destination.name,
        subtitle: destination.tagline,
        imageUrl: destination.image,
        imageAlt: destination.name,
        badgeLabel: destination.region,
        status,
        cardEyebrow: destination.badge || destination.region,
        cardCtaLabel: 'View destination',
        metaFields: [
            { id: 'region', label: 'Region', value: destination.region },
            { id: 'slug', label: 'Slug', value: destination.slug },
            { id: 'season', label: 'Best season', value: destination.bestSeason || '—' },
            { id: 'style', label: 'Travel style', value: destination.travelStyle || '—' },
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
        bodyHtml: usesRichDescription ? description : undefined,
        bodyPlain: usesRichDescription ? undefined : description,
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
