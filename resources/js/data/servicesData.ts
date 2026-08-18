import {
    BedDouble,
    Bus,
    FileCheck2,
    MapPinned,
    Route,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';

import type { ServiceOffering, ServiceProcessStep } from '@/types/services';

export const serviceOfferings: readonly ServiceOffering[] = [
    {
        id: 'guided-tours',
        slug: 'guided-tours',
        title: 'Guided tours',
        tagline: 'Small-group journeys with experienced local guides.',
        description:
            'Join curated departures across Bamiyan, Herat, Kabul and beyond — led by guides who know the routes, culture and practical realities of travel in Afghanistan.',
        category: 'Journey',
        icon: Users,
        features: [
            'Fixed-date small-group departures',
            'English-speaking Afghan lead guide',
            'Permits and regional logistics included',
        ],
        isFeatured: true,
    },
    {
        id: 'custom-itineraries',
        slug: 'custom-itineraries',
        title: 'Custom itineraries',
        tagline: 'Routes shaped around your dates, pace and interests.',
        description:
            'From photography expeditions to family heritage trips — our planners build bespoke routes that match how you want to travel, not a fixed template.',
        category: 'Journey',
        icon: Route,
        features: [
            'One-to-one consultation before you book',
            'Flexible pacing and accommodation level',
            'Special interests: culture, trekking, research',
        ],
        isFeatured: true,
    },
    {
        id: 'private-tours',
        slug: 'private-tours',
        title: 'Private tours',
        tagline: 'Your own guide and vehicle, at your own pace.',
        description:
            'Ideal for couples, families or small groups who want privacy, flexibility and direct access to a dedicated guide throughout the journey.',
        category: 'Journey',
        icon: UserCheck,
        features: [
            'Private vehicle and vetted driver',
            'Dedicated guide for your group only',
            'Adjust daily plans on the ground',
        ],
    },
    {
        id: 'local-guides',
        slug: 'local-guides',
        title: 'Local guides',
        tagline: 'Certified Afghan guides for city walks and specialist visits.',
        description:
            'Day guides and regional specialists for museums, bazaars, archaeological sites and cultural encounters — with context you will not find in a guidebook.',
        category: 'On-ground',
        icon: MapPinned,
        features: [
            'City, heritage and regional specialists',
            'Cultural etiquette and translation support',
            'Available for single days or full circuits',
        ],
    },
    {
        id: 'transportation',
        slug: 'transportation',
        title: 'Transport coordination',
        tagline: 'Reliable vehicles matched to your route and group size.',
        description:
            'We arrange 4WD Land Cruisers, domestic flights and airport transfers through trusted drivers who know highland passes, city traffic and remote roads.',
        category: 'On-ground',
        icon: Bus,
        features: [
            '4WD vehicles for highland and remote routes',
            'Domestic flight booking assistance',
            'Airport meet-and-greet in Kabul',
        ],
    },
    {
        id: 'accommodation',
        slug: 'accommodation',
        title: 'Accommodation coordination',
        tagline: 'Guesthouses and hotels chosen for comfort and character.',
        description:
            'From boutique city hotels to heritage guesthouses in Bamiyan — we select stays for location, safety and authentic local hospitality.',
        category: 'On-ground',
        icon: BedDouble,
        features: [
            'Vetted hotels and heritage guesthouses',
            'Group and solo room arrangements',
            'Dietary needs communicated in advance',
        ],
    },
    {
        id: 'visa-permits',
        slug: 'visa-permits',
        title: 'Visa & permit support',
        tagline: 'Official LOI letters and provincial tourism permits.',
        description:
            'We guide you through visa invitation letters, Ministry permits and regional access paperwork — so you arrive with documentation in order.',
        category: 'Logistics',
        icon: FileCheck2,
        features: [
            'Letter of Invitation (LOI) coordination',
            'Provincial tourism and site permits',
            'Pre-trip document checklist and advice',
        ],
    },
    {
        id: 'safety-briefing',
        slug: 'safety-briefing',
        title: 'Safety & field briefing',
        tagline: 'Clear communication before and during your journey.',
        description:
            'Every traveler receives a pre-departure briefing on routes, customs, dress and current ground realities — with 24/7 operations contact while in country.',
        category: 'Logistics',
        icon: ShieldCheck,
        features: [
            'Pre-trip safety and cultural briefing',
            '24/7 Kabul operations contact',
            'Route adjustments when conditions change',
        ],
    },
];

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

export function getServiceCategories(): readonly ServiceOffering['category'][] {
    return ['Journey', 'On-ground', 'Logistics'];
}
