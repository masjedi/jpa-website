import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { primaryTranslation } from '@/lib/translations';
import type { FaqItem } from '@/types/faq';

export function buildFaqViewModel(item: FaqItem): ContentRecordViewModel {
    const question = primaryTranslation(item.question);
    const answer = primaryTranslation(item.answer);

    return {
        title: question,
        subtitle: answer,
        status: item.status,
        showCardPreview: false,
        showContentSection: false,
        metaFields: [
            { id: 'order', label: 'Order', value: String(item.order) },
            { id: 'updated', label: 'Updated', value: item.updated },
            { id: 'status', label: 'Status', value: item.status },
        ],
    };
}
