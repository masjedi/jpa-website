import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { ServiceOffering } from '@/types/services';

export function buildServiceViewModel(offering: ServiceOffering): ContentRecordViewModel {
    return {
        title: offering.title,
        subtitle: offering.tagline,
        status: offering.status,
        badgeLabel: offering.category,
        showCardPreview: false,
        showContentSection: true,
        bodyPlain: offering.description,
        highlights: offering.features,
        metaFields: [
            { id: 'slug', label: 'Slug', value: offering.slug },
            { id: 'icon', label: 'Icon', value: offering.iconKey },
            { id: 'featured', label: 'Featured', value: offering.isFeatured ? 'Yes' : 'No' },
            { id: 'home', label: 'Home', value: offering.showOnHome ? 'Yes' : 'No' },
            { id: 'order', label: 'Order', value: String(offering.order) },
            { id: 'updated', label: 'Updated', value: offering.updated },
            { id: 'status', label: 'Status', value: offering.status },
        ],
    };
}
