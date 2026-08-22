import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { HeroSlide } from '@/data/heroSectionData';

interface BuildHeroSlideViewModelOptions {
    slide: HeroSlide;
    eyebrow: string;
}

export function buildHeroSlideViewModel({
    slide,
    eyebrow,
}: BuildHeroSlideViewModelOptions): ContentRecordViewModel {
    return {
        title: slide.title,
        subtitle: slide.subtitle,
        badgeLabel: eyebrow,
        status: slide.status,
        showCardPreview: false,
        showContentSection: false,
        metaFields: [
            { id: 'order', label: 'Order', value: String(slide.order) },
            { id: 'updated', label: 'Updated', value: slide.updated },
            { id: 'status', label: 'Status', value: slide.status },
        ],
    };
}
