export type TestimonialStatus = 'Published' | 'Draft';

export interface Testimonial {
    id: number;
    name: string;
    journey: string;
    text: string;
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
    rating: number;
}
