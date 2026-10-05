import {
    Bus,
    Compass,
    FileCheck2,
    HandHeart,
    Handshake,
    MapPinned,
    Route,
    ShieldCheck,
    Users,
} from 'lucide-react';

import type {
    AboutJourneyStep,
    AboutMissionVision,
    AboutMilestone,
    AboutStat,
    AboutValue,
    AboutWhatWeDoItem,
    AboutWhyChooseItem,
    TeamMember,
} from '@/types/about';

export const aboutPage = {
    intro: {
        eyebrow: 'JPA',
        title: 'Our Journey',
        description:
            'Journey to Peace Afghanistan Tours began with Afghan guides showing travellers the country through local eyes. Today we plan, lead and stand behind every itinerary — from first inquiry to the final farewell.',
    },
} as const;

export const aboutJourneySteps: readonly AboutJourneyStep[] = [
    {
        title: 'Local guiding roots',
        description:
            'We began in 2019 guiding researchers, photographers and early visitors through Kabul and Bamiyan — learning routes face to face and building trust with hosts along the way.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Mountain landscape in the Afghan highlands',
        icon: Compass,
    },
    {
        title: 'Small-group tour seasons',
        description:
            'By 2021 we launched structured small-group departures led by Afghan guides — turning lived knowledge into carefully timed seasons across the central highlands.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Travellers sharing tea with local hosts',
        icon: Users,
    },
    {
        title: 'Heritage-led itineraries',
        description:
            'Our guides now weave Silk Road history, mosque etiquette and artisan visits into every route — helping travellers engage respectfully with the places they explore.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Historic architecture and cultural heritage in Afghanistan',
        icon: HandHeart,
    },
    {
        title: 'Guides across Afghanistan',
        description:
            'Today our team coordinates guides, drivers and regional hosts across twelve areas — each itinerary reviewed by someone who has recently travelled the route.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Local artisan workshop visit on a guided journey',
        icon: Route,
    },
    {
        title: 'Responsible tourism ahead',
        description:
            'We are expanding village homestays, guide training and community partnerships — so tourism supports Afghan families and preserves the heritage our guides interpret every day.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Guide preparing for a cultural heritage journey',
        icon: ShieldCheck,
    },
];

export const aboutStory = {
    eyebrow: 'Our story',
    title: 'Guided by Afghans, built for travellers',
    paragraphs: [
        'JPA began with a simple conviction: Afghanistan deserves to be experienced through Afghan eyes — with honesty, care and deep local knowledge.',
        'Today we design small-group tours and private itineraries across Bamiyan, Herat, Kabul and beyond — always reviewed by someone who has walked the route.',
    ],
    images: {
        primary: {
            src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            alt: 'Hindu Kush mountain landscape in Afghanistan',
        },
        secondary: {
            src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
            alt: 'Shared tea with local hosts',
        },
    },
} as const;

export const aboutMissionVision: AboutMissionVision = {
    mission: {
        title: 'Our Mission',
        description:
            'To guide thoughtful travellers through Afghanistan with Afghan-led expertise — offering honest planning, cultural respect and safety at the centre of every tour, trek and custom itinerary.',
    },
    vision: {
        title: 'Our Vision',
        description:
            'A future where responsible tourism strengthens Afghan communities, preserves heritage and rebuilds trust between visitors and the guides who welcome them across the country we call home.',
    },
};

export const aboutWhatWeDo: readonly AboutWhatWeDoItem[] = [
    {
        title: 'Guided tours',
        description: 'Curated small-group departures led by experienced Afghan guides.',
        icon: Users,
    },
    {
        title: 'Custom itineraries',
        description: 'Bespoke routes shaped around your dates, pace and interests.',
        icon: Route,
    },
    {
        title: 'Private travel',
        description: 'Dedicated guide and vehicle for couples, families and small groups.',
        icon: MapPinned,
    },
    {
        title: 'Ground logistics',
        description: 'Transport, accommodation and regional permits coordinated end to end.',
        icon: Bus,
    },
    {
        title: 'Visa support',
        description: 'Invitation letters and documentation guidance for your application.',
        icon: FileCheck2,
    },
    {
        title: 'Safety briefings',
        description: 'Pre-departure calls covering routes, customs and on-ground expectations.',
        icon: ShieldCheck,
    },
];

export const aboutWhyChooseUs: readonly AboutWhyChooseItem[] = [
    {
        title: 'Afghan-owned expertise',
        description:
            'Every itinerary is designed and reviewed by our Kabul-based team — not outsourced to a distant operator.',
        icon: MapPinned,
    },
    {
        title: 'Human-reviewed planning',
        description:
            'Inquiry-based bookings with clear pricing and honest limitations — no instant-confirmation theatre.',
        icon: FileCheck2,
    },
    {
        title: 'Culture-first guiding',
        description:
            'We prepare travellers on customs, dress and photography consent so visits are welcomed, not tolerated.',
        icon: HandHeart,
    },
    {
        title: 'Community partnerships',
        description:
            'Direct relationships with guesthouses, artisans and village hosts keep tourism income local.',
        icon: Handshake,
    },
];

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

export const aboutTeam = {
    hero: {
        title: 'Meet our Team',
        description:
            'A diverse team of passionate professionals with unique skills driving innovation and excellence in every journey.',
    },
    grid: {
        title: 'Team',
        description:
            'A diverse group of passionate professionals, each bringing unique skills and experiences to drive innovation and excellence in every project we undertake.',
    },
} as const;

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
        email: 'wahid@journey-to-afghanistan.com',
        whatsapp: '+93 70 123 4567',
        whatsappHref: 'https://wa.me/93701234567',
    },
    {
        id: 'sara-ahmad',
        name: 'Sara Ahmad',
        role: 'Operations & editorial lead',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        bio: 'Sara coordinates every itinerary from inquiry to departure and writes most of our travel guides. She believes good planning is invisible.',
        languages: ['Dari', 'English'],
        email: 'sara@journey-to-afghanistan.com',
        whatsapp: '+93 70 234 5678',
        whatsappHref: 'https://wa.me/93702345678',
    },
    {
        id: 'omar-khair',
        name: 'Omar Khair',
        role: 'Cultural heritage specialist',
        location: 'Herat',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        bio: 'A former museum researcher, Omar leads our Silk Road interpretation and artisan visits in Herat and Balkh.',
        languages: ['Dari', 'English', 'Farsi'],
        email: 'omar@journey-to-afghanistan.com',
        whatsapp: '+93 72 345 6789',
        whatsappHref: 'https://wa.me/93723456789',
    },
    {
        id: 'fatima-noori',
        name: 'Fatima Noori',
        role: 'Safety & logistics coordinator',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
        bio: 'Fatima runs our pre-departure briefings and monitors route conditions daily. Nothing moves until her checklist says so.',
        languages: ['Dari', 'Pashto', 'English'],
        email: 'fatima@journey-to-afghanistan.com',
        whatsapp: '+93 70 456 7890',
        whatsappHref: 'https://wa.me/93704567890',
    },
    {
        id: 'ahmad-popal',
        name: 'Ahmad Popal',
        role: 'Senior mountain guide',
        location: 'Bamiyan',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        bio: 'Born in the Foladi valley, Ahmad has led treks around Band-e Amir for a decade and knows every highland family we stay with.',
        languages: ['Dari', 'Hazaragi', 'English'],
        email: 'ahmad@journey-to-afghanistan.com',
        whatsapp: '+93 79 567 8901',
        whatsappHref: 'https://wa.me/93795678901',
    },
    {
        id: 'laila-sadat',
        name: 'Laila Sadat',
        role: 'Guest relations',
        location: 'Kabul',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        bio: 'Laila is the first voice most travellers hear. She answers inquiries, matches travellers to itineraries and follows up after every journey.',
        languages: ['Dari', 'English', 'Urdu'],
        email: 'info@journey-to-afghanistan.com',
        whatsapp: '+49 177 6687088',
        whatsappHref: 'https://wa.me/491776687088',
    },
];
