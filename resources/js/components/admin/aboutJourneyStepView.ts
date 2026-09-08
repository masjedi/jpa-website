import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { primaryTranslation } from '@/lib/translations';
import type { AboutJourneyStep } from '@/types/aboutPage';

export function buildAboutJourneyStepViewModel(step: AboutJourneyStep): ContentRecordViewModel {
    const title = primaryTranslation(step.title);
    const description = primaryTranslation(step.description);
    const imageAlt = primaryTranslation(step.imageAlt);

    return {
        title,
        subtitle: description,
        imageUrl: step.image,
        imageAlt,
        status: step.status,
        metaFields: [
            { id: 'icon', label: 'Icon', value: step.iconKey },
            { id: 'order', label: 'Order', value: String(step.order) },
            { id: 'updated', label: 'Updated', value: step.updated },
            { id: 'status', label: 'Status', value: step.status },
        ],
    };
}
