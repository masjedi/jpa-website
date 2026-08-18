import type { Destination } from '@/types/destinations';

export const allDestinations: readonly Destination[] = [
    {
        id: 'bamiyan-valley',
        slug: 'bamiyan-valley',
        name: 'Bamiyan Valley',
        tagline: 'Alpine lakes, cliff monasteries, and highland silence.',
        region: 'Central Highlands',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        badge: 'Signature',
        description:
            'The heart of the Hazarajat highlands — where UNESCO heritage meets Band-e Amir’s turquoise lakes, village hospitality, and some of Afghanistan’s most photogenic mountain landscapes.',
        highlights: [
            'Buddha cliff niches and 5th-century cave monasteries',
            'Band-e Amir National Park lakes and viewpoints',
            'Shahr-e Gholghola and the Red City fortress ruins',
            'Hazara craft cooperatives and community dinners',
        ],
        bestSeason: 'May – October',
        travelStyle: 'Cultural & nature',
        practicalNotes: [
            'Highland roads or domestic flights from Kabul',
            'Moderate walking on heritage sites and lake trails',
            'Provincial permits arranged with your itinerary',
        ],
        tourMatchKeywords: ['Bamiyan', 'Central Highlands', 'Band-e Amir'],
        isFeatured: true,
    },
    {
        id: 'kabul',
        slug: 'kabul',
        name: 'Kabul',
        tagline: 'Museums, gardens, and the rhythm of the capital.',
        region: 'Capital & East',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        badge: 'Gateway',
        description:
            'Afghanistan’s capital is the natural starting point for most journeys — a layered city of Mughal gardens, restored old quarters, national museums, and hillside viewpoints over the Kabul basin.',
        highlights: [
            'Gardens of Babur and historic Murad Khani quarter',
            'National Museum antiquities and Silk Road collections',
            'Bird market, calligraphy workshops, and copper bazaars',
            'Briefing hub for permits, flights, and journey logistics',
        ],
        bestSeason: 'Year-round',
        travelStyle: 'Urban heritage',
        practicalNotes: [
            'Most itineraries begin and end in Kabul',
            'City walks are generally easy-paced',
            'Security briefings provided before regional travel',
        ],
        tourMatchKeywords: ['Kabul', 'Capital', 'Eastern'],
    },
    {
        id: 'panjshir-valley',
        slug: 'panjshir-valley',
        name: 'Panjshir Valley',
        tagline: 'Emerald gorges and orchard-lined river drives.',
        region: 'Capital & East',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        description:
            'A dramatic day-trip or overnight extension from Kabul — following the Panjshir river through rocky defiles, emerald mines, and mountain orchards loved by photographers.',
        highlights: [
            'Panjshir river gorge scenic drives',
            'Riverside picnics and trout lunches',
            'Emerald mine viewpoints and village stops',
            'Easy pairing with Kabul city itineraries',
        ],
        bestSeason: 'March – November',
        travelStyle: 'Photography & day trips',
        practicalNotes: [
            'Typically visited as a day or overnight from Kabul',
            'Road conditions vary by season',
            'Ideal for travellers wanting mountain scenery near the capital',
        ],
        tourMatchKeywords: ['Panjshir', 'Kabul'],
    },
    {
        id: 'herat',
        slug: 'herat',
        name: 'Herat',
        tagline: 'Timurid tilework, citadels, and living bazaars.',
        region: 'Western Silk Road',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        badge: 'Heritage',
        description:
            'Afghanistan’s western cultural capital — cobalt Friday Mosque mosaics, Alexander’s citadel, Sufi shrines, and master artisans still working tile, glass, and carpet traditions.',
        highlights: [
            'Friday Mosque and Timurid tile workshops',
            'Herat Citadel and Musalla complex monuments',
            'Covered bazaars, saffron markets, and carpet alleys',
            'Domestic flights connect Herat with Kabul and Mazar',
        ],
        bestSeason: 'March – May, September – November',
        travelStyle: 'Art & Silk Road history',
        practicalNotes: [
            'Internal flights recommended for time efficiency',
            'Dress modestly when visiting shrines and mosques',
            'Photography rules apply at some religious sites',
        ],
        tourMatchKeywords: ['Herat', 'Western Silk Road', 'Silk Road'],
        isFeatured: true,
    },
    {
        id: 'mazar-i-sharif',
        slug: 'mazar-i-sharif',
        name: 'Mazar-i-Sharif & Balkh',
        tagline: 'Blue Mosque serenity and ancient Bactrian ruins.',
        region: 'Northern Region',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        description:
            'Northern Afghanistan’s spiritual and archaeological heart — the Blue Mosque, ancient Balkh (“Mother of Cities”), and rock-cut monasteries at Takht-e Rostam.',
        highlights: [
            'Shrine of Hazrat Ali and Blue Mosque courtyards',
            'Ancient Balkh ramparts and Haji Piyada mosque',
            'Takht-e Rostam rock-cut Buddhist stupa',
            'Northern bazaars, dried fruits, and silversmiths',
        ],
        bestSeason: 'April – June, September – October',
        travelStyle: 'Cultural & heritage',
        practicalNotes: [
            'Reachable by flight or scenic overland via Salang',
            'Shrine visits require respectful dress and conduct',
            'Combine easily with Herat on multi-city routes',
        ],
        tourMatchKeywords: ['Mazar', 'Balkh', 'Northern'],
    },
    {
        id: 'wakhan-corridor',
        slug: 'wakhan-corridor',
        name: 'Wakhan Corridor',
        tagline: 'Pamir peaks, Kyrgyz yurts, and remote frontier trails.',
        region: 'Pamir & Badakhshan',
        image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80',
        badge: 'Expedition',
        description:
            'The remote northeastern panhandle where Afghanistan meets the Pamir — high passes, Wakhi villages, Kyrgyz nomad camps, and some of the country’s most demanding trekking.',
        highlights: [
            'Wakhan Valley 4WD approach via Ishkashim',
            'High Pamir trekking with pack horses',
            'Kyrgyz nomad encounters at remote summer pastures',
            'Frontier landscapes bordering Tajikistan and Pakistan',
        ],
        bestSeason: 'June – September',
        travelStyle: 'Adventure & trekking',
        practicalNotes: [
            'Expedition-level fitness and advance permit planning',
            'Limited infrastructure — camping and homestays',
            'Seasonal access only; custom logistics required',
        ],
        tourMatchKeywords: ['Wakhan', 'Pamir', 'Badakhshan'],
    },
    {
        id: 'kandahar',
        slug: 'kandahar',
        name: 'Kandahar',
        tagline: 'Durrani heritage and Arghandab oasis orchards.',
        region: 'Southern Plains',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        description:
            'The historic seat of the Durrani empire — old city gates, Chihil Zina rock reliefs, royal mausoleums, and the green Arghandab valley beyond the desert plains.',
        highlights: [
            'Chihil Zina cliff reliefs and Ahmad Shah Mausoleum',
            'Old city gates and Durrani imperial landmarks',
            'Arghandab Valley orchard walks and river tea stops',
            'Southern spice and embroidery bazaars',
        ],
        bestSeason: 'October – April',
        travelStyle: 'History & regional culture',
        practicalNotes: [
            'Domestic flights from Kabul recommended',
            'Itineraries planned with current regional guidance',
            'Best suited to experienced Afghanistan travellers',
        ],
        tourMatchKeywords: ['Kandahar', 'Southern'],
    },
    {
        id: 'nuristan',
        slug: 'nuristan',
        name: 'Nuristan',
        tagline: 'Cedar forests, cliff villages, and hidden valleys.',
        region: 'Capital & East',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
        badge: 'Remote',
        description:
            'Forested eastern valleys of wooden architecture, walnut groves, and distinct Nuristani culture — reached via scenic drives from Kabul through Jalalabad and Kunar.',
        highlights: [
            'Parun and Waygal valley village treks',
            'Traditional woodcarving and mountain tea rituals',
            'Cedar forest walks and river gorge scenery',
            'Cultural immersion in one of Afghanistan’s most distinct regions',
        ],
        bestSeason: 'May – October',
        travelStyle: 'Adventure & ethnography',
        practicalNotes: [
            'Demanding roads and moderate trekking required',
            'Custom expedition planning and permits essential',
            'Homestay-based itineraries recommended',
        ],
        tourMatchKeywords: ['Nuristan', 'Eastern'],
    },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
    return allDestinations.find((destination) => destination.slug === slug);
}

export function getRelatedDestinations(
    slug: string,
    limit = 2,
): readonly Destination[] {
    const current = getDestinationBySlug(slug);

    if (!current) {
        return [];
    }

    const sameRegion = allDestinations.filter(
        (destination) =>
            destination.slug !== slug &&
            destination.region === current.region,
    );
    const others = allDestinations.filter(
        (destination) =>
            destination.slug !== slug &&
            destination.region !== current.region,
    );

    return [...sameRegion, ...others].slice(0, limit);
}

export function getDestinationRegions(): readonly Destination['region'][] {
    return Array.from(
        new Set(allDestinations.map((destination) => destination.region)),
    );
}
