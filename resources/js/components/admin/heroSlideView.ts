import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { primaryTranslation } from '@/lib/translations';
import type { HeroSlide } from '@/types/heroSection';
import { LOCALE_CODES, LOCALE_LABELS, type TranslatedString } from '@/types/locale';

interface BuildHeroSlideViewModelOptions {
    slide: HeroSlide;
    eyebrow: TranslatedString;
}

export function buildHeroSlideViewModel({
    slide,
    eyebrow,
}: BuildHeroSlideViewModelOptions): ContentRecordViewModel {
    return {
        title: primaryTranslation(slide.title),
        subtitle: primaryTranslation(slide.subtitle),
        badgeLabel: primaryTranslation(eyebrow),
        status: slide.status,
        showCardPreview: Boolean(slide.imageThumbUrl),
        imageUrl: slide.imageThumbUrl ?? undefined,
        showContentSection: false,
        metaFields: [
            ...LOCALE_CODES.filter((locale) => locale !== 'en').map((locale) => ({
                id: `title-${locale}`,
                label: `Title (${LOCALE_LABELS[locale]})`,
                value: slide.title[locale] || '—',
            })),
            ...LOCALE_CODES.filter((locale) => locale !== 'en').map((locale) => ({
                id: `subtitle-${locale}`,
                label: `Subtitle (${LOCALE_LABELS[locale]})`,
                value: slide.subtitle[locale] || '—',
            })),
            { id: 'order', label: 'Order', value: String(slide.order) },
            { id: 'updated', label: 'Updated', value: slide.updated },
            { id: 'status', label: 'Status', value: slide.status },
        ],
    };
}
