import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { AboutJourneyStep } from '@/types/aboutPage';

export function buildAboutJourneyStepViewModel(step: AboutJourneyStep): ContentRecordViewModel {
    return {
        title: step.title,
        subtitle: step.description,
        imageUrl: step.image,
        imageAlt: step.imageAlt,
        status: step.status,
        metaFields: [
            { id: 'icon', label: 'Icon', value: step.iconKey },
            { id: 'order', label: 'Order', value: String(step.order) },
            { id: 'updated', label: 'Updated', value: step.updated },
            { id: 'status', label: 'Status', value: step.status },
        ],
    };
}
