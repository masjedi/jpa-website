import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { getToursForDestination } from '@/data/destinationTours';
import { isRichTextHtml } from '@/lib/richText';
import type { Destination } from '@/types/destinations';

interface BuildDestinationViewModelOptions {
    destination: Destination;
    status: ContentRecordStatus;
}

export function buildDestinationViewModel({
    destination,
    status,
}: BuildDestinationViewModelOptions): ContentRecordViewModel {
    const relatedTours = getToursForDestination(destination);
    const usesRichDescription = isRichTextHtml(destination.description);

    return {
        title: destination.name,
        subtitle: destination.tagline,
        imageUrl: destination.image,
        imageAlt: destination.name,
        badgeLabel: destination.region,
        status,
        cardEyebrow: destination.region,
        cardCtaLabel: 'View destination',
        metaFields: [
            { id: 'region', label: 'Region', value: destination.region },
            { id: 'slug', label: 'Slug', value: destination.slug },
            { id: 'status', label: 'Status', value: status },
            {
                id: 'tours',
                label: 'Linked tours',
                value: String(relatedTours.length),
            },
        ],
        bodyHtml: usesRichDescription ? destination.description : undefined,
        bodyPlain: usesRichDescription ? undefined : destination.description,
        highlights: usesRichDescription ? undefined : [...destination.highlights],
        relatedItems:
            relatedTours.length > 0
                ? relatedTours.slice(0, 4).map((tour) => ({
                      id: tour.id,
                      title: tour.title,
                      meta: `${tour.duration} · ${tour.travelStyle}`,
                  }))
                : undefined,
        relatedItemsTitle: 'Tours that visit here',
    };
}
