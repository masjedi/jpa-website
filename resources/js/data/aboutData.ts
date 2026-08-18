import { Compass, HandHeart, ShieldCheck, Users } from 'lucide-react';

import type {
    AboutMilestone,
    AboutStat,
    AboutValue,
    TeamMember,
} from '@/types/about';

export const aboutStory = {
    eyebrow: 'Our story',
    title: 'Guided by Afghans, built for travellers',
    paragraphs: [
        'JPA began with a simple conviction: Afghanistan deserves to be experienced through Afghan eyes — with honesty, care and deep local knowledge. What started as informal guiding for visiting researchers grew into a small, dedicated team coordinating journeys across the country.',
        'Today we design small-group tours and private itineraries that connect travellers with the places and people we know best — from the Buddha cliffs of Bamiyan to the Timurid minarets of Herat.',
        'We keep things deliberately personal. Every itinerary is reviewed by a human, every inquiry answered by someone who has walked the route.',
    ],
} as const;

export const aboutMilestones: readonly AboutMilestone[] = [
    {
        year: '2019',
        title: 'First journeys',
        description:
            'Informal guiding for researchers and photographers in Kabul and Bamiyan.',
    },
    {
        year: '2021',
        title: 'Small-group seasons',
        description:
            'First structured small-group departures across the central highlands.',
    },
    {
        year: '2023',
        title: 'Artisan partnerships',
        description:
            'Direct partnerships with craft cooperatives in Herat and Kabul old city.',
    },
    {
        year: '2025',
        title: 'Guide training',
        description:
            'Launched heritage interpretation and first-aid training for junior guides.',
    },
    {
        year: '2026',
        title: 'Community tourism',
        description:
            'Village homestay network expanding across Bamiyan and Panjshir.',
    },
];

export const aboutStats: readonly AboutStat[] = [
    { value: '7+', label: 'Years guiding' },
    { value: '1,200+', label: 'Travellers hosted' },
    { value: '12', label: 'Regions covered' },
    { value: '40+', label: 'Local partners' },
];

export const aboutValues: readonly AboutValue[] = [
    {
        title: 'Local expertise',
        description:
            'Every route is walked by our own team before it is offered. We guide only where we have deep, current knowledge.',
        icon: Compass,
    },
    {
        title: 'Transparent planning',
        description:
            'Inquiry-based bookings reviewed by humans. Clear pricing, honest limitations, no instant-confirmation theatre.',
        icon: Users,
    },
    {
        title: 'Cultural respect',
        description:
            'We prepare travellers on customs, dress and photography consent so visits are welcomed, not tolerated.',
        icon: HandHeart,
    },
    {
        title: 'Safety first',
        description:
            'Route conditions are checked continuously. Itineraries adapt to reality, not the other way around.',
        icon: ShieldCheck,
    },
];

export const teamMembers: readonly TeamMember[] = [
    {
        id: 'wahid-rahimi',
        name: 'Wahid Rahimi',
        role: 'Founder & lead guide',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
        bio: 'Wahid has guided across all 34 provinces and still leads our flagship heritage circuits. He started JPA to show travellers the Afghanistan he grew up in — hospitable, layered and unforgettable.',
        languages: ['Dari', 'Pashto', 'English'],
        isFounder: true,
    },
    {
        id: 'sara-ahmad',
        name: 'Sara Ahmad',
        role: 'Operations & editorial lead',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        bio: 'Sara coordinates every itinerary from inquiry to departure and writes most of our travel guides. She believes good planning is invisible.',
        languages: ['Dari', 'English'],
    },
    {
        id: 'omar-khair',
        name: 'Omar Khair',
        role: 'Cultural heritage specialist',
        location: 'Herat',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        bio: 'A former museum researcher, Omar leads our Silk Road interpretation and artisan visits in Herat and Balkh.',
        languages: ['Dari', 'English', 'Farsi'],
    },
    {
        id: 'fatima-noori',
        name: 'Fatima Noori',
        role: 'Safety & logistics coordinator',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
        bio: 'Fatima runs our pre-departure briefings and monitors route conditions daily. Nothing moves until her checklist says so.',
        languages: ['Dari', 'Pashto', 'English'],
    },
    {
        id: 'ahmad-popal',
        name: 'Ahmad Popal',
        role: 'Senior mountain guide',
        location: 'Bamiyan',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        bio: 'Born in the Foladi valley, Ahmad has led treks around Band-e Amir for a decade and knows every highland family we stay with.',
        languages: ['Dari', 'Hazaragi', 'English'],
    },
    {
        id: 'laila-sadat',
        name: 'Laila Sadat',
        role: 'Guest relations',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        bio: 'Laila is the first voice most travellers hear. She answers inquiries, matches travellers to itineraries and follows up after every journey.',
        languages: ['Dari', 'English', 'Urdu'],
    },
];
