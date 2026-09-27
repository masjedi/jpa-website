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
            description="Manage destination, travel style, season, and group type option lists."
            icon={Search}
            defaultType="destination"
            catalogs={[
                {
                    type: 'destination',
                    title: 'Destinations',
                    items: destinations,
                    description: 'Destination options available for catalog and filters.',
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
                    description: 'Season options available for catalog and filters.',
                },
                {
                    type: 'groupType',
                    title: 'Group types',
                    items: groupTypes,
                    description: 'Group type options available for catalog and filters.',
                },
            ]}
        />
    );
}

HomeFinder.layout = withAdminLayout('Home finder');
