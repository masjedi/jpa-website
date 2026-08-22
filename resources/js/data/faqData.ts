import type { FaqItem } from '@/types/faq';

export const allFaqItems: readonly FaqItem[] = [
    {
        id: 1,
        order: 1,
        status: 'Published',
        updated: '1 week ago',
        question: 'Do I need a visa to visit Afghanistan?',
        answer: 'Most nationalities require a visa in advance. We can outline the general process, but requirements change often — always confirm with the nearest Afghan embassy before booking.',
    },
    {
        id: 2,
        order: 2,
        status: 'Published',
        updated: '1 week ago',
        question: 'What should I wear while travelling?',
        answer: 'Modest, loose-fitting clothing is appropriate for most places. Women should carry a headscarf for religious sites. We share detailed guidance with every confirmed itinerary.',
    },
    {
        id: 3,
        order: 3,
        status: 'Published',
        updated: '2 weeks ago',
        question: 'Will I have mobile connectivity?',
        answer: 'Major cities have reliable mobile data; remote valleys can be limited. We help you choose a local SIM and plan offline maps where needed.',
    },
    {
        id: 4,
        order: 4,
        status: 'Published',
        updated: '2 weeks ago',
        question: 'How should I behave around local customs?',
        answer: 'A respectful, observant approach goes a long way. Ask before photographing people, accept hospitality graciously, and follow your guide’s lead in religious or community settings.',
    },
    {
        id: 5,
        order: 5,
        status: 'Published',
        updated: '3 weeks ago',
        question: 'Do I need travel insurance?',
        answer: 'Comprehensive travel insurance that covers your planned activities is strongly recommended. Check that your policy is valid for Afghanistan before departure.',
    },
    {
        id: 6,
        order: 6,
        status: 'Published',
        updated: '3 weeks ago',
        question: 'How does the booking inquiry work?',
        answer: 'Send us your dates, interests and group size. We review availability manually and reply with a tailored quotation. Submitting an inquiry does not reserve a seat or confirm a trip.',
    },
];

export const publishedFaqItems = allFaqItems
    .filter((item) => item.status === 'Published')
    .sort((left, right) => left.order - right.order);
