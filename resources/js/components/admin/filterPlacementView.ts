import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { primaryTranslation } from '@/lib/translations';
import type { TourFilterOption } from '@/types/tourFilterOptions';
import { tourFilterOptionTypeLabels } from '@/types/tourFilterOptions';

export function buildFilterPlacementViewModel(
    option: TourFilterOption,
): ContentRecordViewModel {
    const name = primaryTranslation(option.name);

    return {
        title: name,
        subtitle: tourFilterOptionTypeLabels[option.type],
        status: option.status,
        showCardPreview: false,
        showContentSection: false,
        metaFields: [
            { id: 'type', label: 'Type', value: tourFilterOptionTypeLabels[option.type] },
            { id: 'order', label: 'Order', value: String(option.order) },
            { id: 'updated', label: 'Updated', value: option.updated },
            { id: 'status', label: 'Status', value: option.status },
        ],
    };
}
