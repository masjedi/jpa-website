import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { Testimonial } from '@/types/testimonials';

export function buildTestimonialViewModel(testimonial: Testimonial): ContentRecordViewModel {
    return {
        title: testimonial.name,
        subtitle: testimonial.journey,
        status: testimonial.status,
        showCardPreview: false,
        showContentSection: false,
        metaFields: [
            { id: 'rating', label: 'Rating', value: `${testimonial.rating} / 5` },
            { id: 'order', label: 'Order', value: String(testimonial.order) },
            { id: 'updated', label: 'Updated', value: testimonial.updated },
            { id: 'status', label: 'Status', value: testimonial.status },
        ],
        sections: [
            {
                id: 'quote',
                heading: 'Testimonial',
                paragraphs: [testimonial.text],
            },
        ],
    };
}
