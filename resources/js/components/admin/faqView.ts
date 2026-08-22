import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { FaqItem } from '@/types/faq';

export function buildFaqViewModel(item: FaqItem): ContentRecordViewModel {
    return {
        title: item.question,
        subtitle: item.answer,
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
