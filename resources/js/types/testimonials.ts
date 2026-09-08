import type { TranslatedString } from '@/types/locale';

export type TestimonialStatus = 'Published' | 'Draft';

export interface TestimonialAvatarSpec {
    width: number;
    height: number;
    aspect_ratio: string | null;
    max_upload_kilobytes: number;
    hint: string;
}

export interface Testimonial {
    id: number;
    name: TranslatedString;
    journey: TranslatedString;
    text: TranslatedString;
    image: string;
    rating: number;
    order: number;
    status: TestimonialStatus;
    updated: string;
}

export interface PublicTestimonial {
    id: number;
    name: string;
    journey: string;
    text: string;
    image: string;
    rating: number;
}
