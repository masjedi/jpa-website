import type { ServiceProcessStep } from '@/types/services';

export const serviceProcessSteps: readonly ServiceProcessStep[] = [
    {
        step: '01',
        title: 'Send an inquiry',
        description:
            'Tell us your dates, interests and group size. No payment or instant booking required.',
    },
    {
        step: '02',
        title: 'Receive a proposal',
        description:
            'Our team replies within 24 hours with a tailored itinerary, estimate and permit guidance.',
    },
    {
        step: '03',
        title: 'Refine together',
        description:
            'Adjust routes, pacing and accommodation until the plan feels right for your group.',
    },
    {
        step: '04',
        title: 'Travel with support',
        description:
            'Guides, vehicles and logistics are coordinated on the ground — with us available throughout.',
    },
];
