import type {
    ArticleCategory,
    ArticleDetail,
    ArticleListItem,
} from '@/types/articles';

const authors = {
    sara: {
        name: 'Sara Ahmad',
        role: 'Lead travel editor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    omar: {
        name: 'Omar Khair',
        role: 'Cultural heritage specialist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    fatima: {
        name: 'Fatima Noori',
        role: 'Safety & logistics coordinator',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    },
} as const;

export const allArticles: readonly ArticleDetail[] = [
    {
        id: 'spring-packing-guide',
        slug: 'what-to-pack-for-spring-in-afghanistan',
        title: 'What to pack for spring in Afghanistan',
        summary:
            'Layering, footwear and small essentials for variable mountain weather across the highlands and cities.',
        category: 'Travel tips',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        date: '12 Mar 2026',
        readingTimeMinutes: 7,
        author: authors.sara,
        isFeatured: true,
        relatedTourSlugs: ['bamiyan-heritage-circuit', 'highlands-and-lakes'],
        sections: [
            {
                id: 'climate',
                heading: 'Understanding spring weather',
                paragraphs: [
                    'Spring in Afghanistan is a season of contrast. Mornings in Bamiyan can still dip below freezing while Kabul afternoons climb into the low twenties. The key is versatile layering rather than a single heavy coat.',
                    'Wind is common on exposed ridges and lake viewpoints. A windproof shell that packs small is often more useful than extra insulation.',
                ],
            },
            {
                id: 'clothing',
                heading: 'Clothing essentials',
                paragraphs: [
                    'Modest, loose-fitting clothing remains appropriate everywhere. Women should carry a headscarf for religious sites and conservative neighbourhoods. Neutral colours photograph well and attract less attention in rural areas.',
                    'Sturdy walking shoes with ankle support are essential for heritage sites and uneven village paths. Sandals are fine for hotel evenings in Kabul or Herat, but not for full days on the road.',
                ],
            },
            {
                id: 'gear',
                heading: 'Practical gear',
                paragraphs: [
                    'Sun protection matters at altitude — sunglasses, SPF lip balm and a brimmed hat. A reusable water bottle and small daypack complete the daily kit.',
                    'Power banks are useful on long driving days. Download offline maps before leaving Kabul; signal drops quickly in mountain valleys.',
                ],
            },
        ],
    },
    {
        id: 'herat-traveller-guide',
        slug: 'respectful-travellers-guide-to-herat',
        title: 'A respectful traveller’s guide to Herat',
        summary:
            'Etiquette, photography consent and how to support local artisans in Afghanistan’s great Silk Road city.',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        date: '28 Feb 2026',
        readingTimeMinutes: 9,
        author: authors.omar,
        relatedTourSlugs: ['herat-silk-road-art', 'silk-road-heritage-express'],
        sections: [
            {
                id: 'first-impressions',
                heading: 'First impressions',
                paragraphs: [
                    'Herat rewards slow exploration. The Friday Mosque, Timurid minarets and old bazaar quarters deserve unhurried mornings before the heat builds.',
                    'Your guide will introduce appropriate greetings — a simple “Salam” and right-hand handshake are standard. Patience and a smile go further than rushed itineraries.',
                ],
            },
            {
                id: 'photography',
                heading: 'Photography with consent',
                paragraphs: [
                    'Always ask before photographing people, especially women and elders. Many artisans welcome portraits if you buy from their workshop first.',
                    'Religious sites may restrict interior photography. Follow signage and your guide’s advice without argument.',
                ],
            },
            {
                id: 'artisans',
                heading: 'Supporting local artisans',
                paragraphs: [
                    'Herat is known for glass blowing, miniature painting and carpet weaving. Buying directly from workshops channels income to families rather than middlemen.',
                    'Bargaining is normal in bazaars but not in fixed-price cooperatives. A fair price supports craft continuity — one of the reasons travellers come here.',
                ],
            },
        ],
    },
    {
        id: 'bamiyan-one-week',
        slug: 'one-week-in-bamiyan-practical-route',
        title: 'One week in Bamiyan: a practical route',
        summary:
            'How to structure days between the lakes, the cliffs and village homestays without rushing the highlands.',
        category: 'Itineraries',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        date: '15 Feb 2026',
        readingTimeMinutes: 11,
        author: authors.sara,
        relatedTourSlugs: ['bamiyan-heritage-circuit', 'highlands-and-lakes'],
        sections: [
            {
                id: 'overview',
                heading: 'Route overview',
                paragraphs: [
                    'Seven days in Bamiyan province allows a balanced mix of UNESCO heritage, Band-e Amir lakes and village hospitality — without the fatigue of constant road transfers.',
                    'This outline assumes arrival from Kabul by road or domestic flight. Adjust day one if you fly directly into Bamiyan airfield.',
                ],
            },
            {
                id: 'days-1-3',
                heading: 'Days 1–3: Valley heritage',
                paragraphs: [
                    'Day one: settle in, visit the Buddha niches and Shahr-e Gholghola at golden hour. Day two: cave monasteries and a craft cooperative visit. Day three: gentle acclimatisation walk with panoramic valley views.',
                ],
            },
            {
                id: 'days-4-7',
                heading: 'Days 4–7: Lakes and homestays',
                paragraphs: [
                    'Transfer to Band-e Amir for two nights — boat trips, short hikes and stargazing. Return via a village homestay for one night before departing.',
                    'Build buffer time for weather. Highland roads can slow unexpectedly; a flexible mindset is part of the experience.',
                ],
            },
        ],
    },
    {
        id: 'visa-basics',
        slug: 'afghanistan-visa-basics-for-travellers',
        title: 'Afghanistan visa basics for travellers',
        summary:
            'What to expect from the application process, timelines and documents — before you send a booking inquiry.',
        category: 'Travel tips',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        date: '3 Feb 2026',
        readingTimeMinutes: 6,
        author: authors.fatima,
        sections: [
            {
                id: 'requirements',
                heading: 'General requirements',
                paragraphs: [
                    'Most nationalities need a visa obtained in advance from an Afghan embassy or consulate. Requirements change — always confirm with the mission responsible for your place of residence.',
                    'A valid passport with six months’ remaining validity and blank pages is standard. Invitation letters may be arranged as part of a confirmed itinerary.',
                ],
            },
            {
                id: 'timelines',
                heading: 'Planning timelines',
                paragraphs: [
                    'Allow several weeks for processing, longer during peak travel seasons or if additional checks apply. We outline typical timelines during consultation but cannot guarantee embassy decisions.',
                ],
            },
        ],
    },
    {
        id: 'kabul-museums',
        slug: 'kabul-museums-worth-your-morning',
        title: 'Kabul museums worth your morning',
        summary:
            'From Bactrian gold to Gandharan sculpture — how to plan a focused half-day in the capital’s collections.',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        date: '22 Jan 2026',
        readingTimeMinutes: 8,
        author: authors.omar,
        relatedTourSlugs: ['kabul-panjshir-discovery'],
        sections: [
            {
                id: 'national-museum',
                heading: 'National Museum of Afghanistan',
                paragraphs: [
                    'The renovated National Museum houses Bactrian gold, Buddhist stucco and Silk Road ceramics. Allow two hours minimum; guided interpretation adds significant context.',
                ],
            },
            {
                id: 'timing',
                heading: 'When to visit',
                paragraphs: [
                    'Weekday mornings are quietest. Combine with Babur’s Gardens in the same half-day for a gentle introduction to Kabul before heading to the provinces.',
                ],
            },
        ],
    },
    {
        id: 'safety-briefing',
        slug: 'what-our-pre-trip-safety-briefing-covers',
        title: 'What our pre-trip safety briefing covers',
        summary:
            'Route updates, communication protocols and on-ground expectations — explained before you travel.',
        category: 'Safety',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        date: '10 Jan 2026',
        readingTimeMinutes: 5,
        author: authors.fatima,
        sections: [
            {
                id: 'briefing',
                heading: 'The briefing session',
                paragraphs: [
                    'Every confirmed itinerary includes a pre-departure briefing — by video call or in person in Kabul. We cover current route conditions, communication plans and cultural expectations.',
                    'You receive emergency contacts, daily check-in procedures and guidance on local customs. Questions are encouraged; no topic is off limits.',
                ],
            },
        ],
    },
    {
        id: 'photography-permits',
        slug: 'photography-in-afghanistan-permits-and-practice',
        title: 'Photography in Afghanistan: permits and practice',
        summary:
            'Drone rules, sensitive sites and how to capture the country responsibly without compromising security.',
        category: 'Photography',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70b?auto=format&fit=crop&w=1200&q=80',
        date: '2 Jan 2026',
        readingTimeMinutes: 7,
        author: authors.sara,
        sections: [
            {
                id: 'drones',
                heading: 'Drones and equipment',
                paragraphs: [
                    'Drone use is heavily restricted and generally not permitted for tourists without special authorisation. Leave drones at home unless we have confirmed written approval for your route.',
                    'Professional camera gear is usually fine. Declare valuable equipment on entry if required by customs.',
                ],
            },
            {
                id: 'sensitive-sites',
                heading: 'Sensitive locations',
                paragraphs: [
                    'Military installations, checkpoints and government buildings must not be photographed. Your guide will signal when to put cameras away — follow promptly without debate.',
                ],
            },
        ],
    },
    {
        id: 'panjshir-day-trip',
        slug: 'panjshir-valley-day-trip-from-kabul',
        title: 'Panjshir Valley: a day trip from Kabul',
        summary:
            'Emerald rivers, massif views and a manageable escape from the capital when conditions allow.',
        category: 'Itineraries',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        date: '18 Dec 2025',
        readingTimeMinutes: 6,
        author: authors.sara,
        relatedTourSlugs: ['kabul-panjshir-discovery'],
        sections: [
            {
                id: 'route',
                heading: 'The route',
                paragraphs: [
                    'Panjshir lies northeast of Kabul — a scenic drive through narrowing gorges to river valleys backed by dramatic peaks. The full loop fits a long day with an early start.',
                ],
            },
        ],
    },
    {
        id: 'hazara-hospitality',
        slug: 'understanding-hazara-hospitality-in-bamiyan',
        title: 'Understanding Hazara hospitality in Bamiyan',
        summary:
            'Tea customs, guest rooms and how to receive generosity graciously in highland communities.',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        date: '5 Dec 2025',
        readingTimeMinutes: 8,
        author: authors.omar,
        relatedTourSlugs: ['bamiyan-heritage-circuit'],
        sections: [
            {
                id: 'customs',
                heading: 'Guest customs',
                paragraphs: [
                    'Homestay hosts often offer the best room and endless tea. Accepting graciously — even a small portion — honours the gesture. Small gifts from your home country are appreciated but never expected.',
                ],
            },
        ],
    },
    {
        id: 'travel-insurance',
        slug: 'travel-insurance-for-afghanistan-what-to-check',
        title: 'Travel insurance for Afghanistan: what to check',
        summary:
            'Policy wording, evacuation cover and activity exclusions — a checklist before you purchase.',
        category: 'Safety',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        date: '20 Nov 2025',
        readingTimeMinutes: 6,
        author: authors.fatima,
        sections: [
            {
                id: 'coverage',
                heading: 'Coverage essentials',
                paragraphs: [
                    'Confirm your policy explicitly covers Afghanistan — many standard policies exclude the country entirely. Medical evacuation cover is strongly recommended.',
                    'Declare planned activities: trekking, high-altitude travel and photography expeditions may need specific riders.',
                ],
            },
        ],
    },
];

export function getArticleBySlug(slug: string): ArticleDetail | undefined {
    return allArticles.find((article) => article.slug === slug);
}

export function getFeaturedArticle(): ArticleDetail | undefined {
    return allArticles.find((article) => article.isFeatured);
}

export function getArticleCategories(): readonly ArticleCategory[] {
    const categories = new Set<ArticleCategory>();
    for (const article of allArticles) {
        categories.add(article.category);
    }
    return [...categories].sort();
}

export function getCategoryCount(category: ArticleCategory): number {
    return allArticles.filter((article) => article.category === category).length;
}

export function getRelatedArticles(
    slug: string,
    limit = 3,
): readonly ArticleListItem[] {
    const current = getArticleBySlug(slug);
    if (!current) {
        return [];
    }

    return allArticles
        .filter(
            (article) =>
                article.slug !== slug &&
                (article.category === current.category ||
                    article.author.name === current.author.name),
        )
        .slice(0, limit);
}

export function toArticleListItem(article: ArticleDetail): ArticleListItem {
    return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        category: article.category,
        image: article.image,
        date: article.date,
        readingTimeMinutes: article.readingTimeMinutes,
        author: article.author,
        isFeatured: article.isFeatured,
    };
}
