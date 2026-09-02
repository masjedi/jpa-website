import { Search } from 'lucide-react';

import { FilterOptionCatalogPage } from '@/components/admin/FilterOptionCatalogPage';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { TourFilterOption } from '@/types/tourFilterOptions';

interface HomeFinderPageProps {
    destinations: TourFilterOption[];
    travelStyles: TourFilterOption[];
    seasons: TourFilterOption[];
    groupTypes: TourFilterOption[];
}

export default function HomeFinder({
    destinations,
    travelStyles,
    seasons,
    groupTypes,
}: HomeFinderPageProps) {
    return (
        <FilterOptionCatalogPage
            pageId="home-finder"
            title="Home finder"
            description="These lists drive Destination, Travel style, Preferred season, and Group type on the homepage."
            icon={Search}
            defaultType="destination"
            catalogs={[
                {
                    type: 'destination',
                    title: 'Destinations',
                    items: destinations,
                    description: 'Used by the homepage finder Destination field.',
                },
                {
                    type: 'travelStyle',
                    title: 'Travel styles',
                    items: travelStyles,
                    description: 'Shared with Filter & Placement and the public tours filters.',
                },
                {
                    type: 'season',
                    title: 'Seasons',
                    items: seasons,
                    description: 'Used by the homepage finder Preferred season field.',
                },
                {
                    type: 'groupType',
                    title: 'Group types',
                    items: groupTypes,
                    description: 'Used by the homepage finder Group type field.',
                },
            ]}
        />
    );
}

HomeFinder.layout = withAdminLayout('Home finder');
