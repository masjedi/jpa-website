import type { HomeServicePreview } from '@/types/services';

export type HomeServiceEditorialKey =
    | 'tailorMade'
    | 'privateGuides'
    | 'transport'
    | 'accommodation';

export interface HomeServiceEditorialRow {
    key: HomeServiceEditorialKey;
    number: string;
    sourceServiceIds: number[];
}

const HOME_SERVICE_GROUPS: ReadonlyArray<{
    key: HomeServiceEditorialKey;
    number: string;
    slugs: readonly string[];
}> = [
    {
        key: 'tailorMade',
        number: '01',
        slugs: ['guided-tours', 'custom-itineraries'],
    },
    {
        key: 'privateGuides',
        number: '02',
        slugs: ['private-tours', 'local-guides'],
    },
    {
        key: 'transport',
        number: '03',
        slugs: ['transportation'],
    },
    {
        key: 'accommodation',
        number: '04',
        slugs: ['accommodation'],
    },
];

export function mapHomeServicesToEditorialRows(
    services: readonly HomeServicePreview[],
): HomeServiceEditorialRow[] {
    if (services.length === 0) {
        return [];
    }

    const servicesBySlug = new Map(
        services.map((service) => [service.slug, service] as const),
    );

    return HOME_SERVICE_GROUPS.flatMap((group) => {
        const matched = group.slugs
            .map((slug) => servicesBySlug.get(slug))
            .filter((service): service is HomeServicePreview => service !== undefined);

        if (matched.length === 0) {
            return [];
        }

        return [
            {
                key: group.key,
                number: group.number,
                sourceServiceIds: matched.map((service) => service.id),
            },
        ];
    });
}
