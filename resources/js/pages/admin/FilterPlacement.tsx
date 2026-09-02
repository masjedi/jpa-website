import { Filter } from 'lucide-react';

import { FilterOptionCatalogPage } from '@/components/admin/FilterOptionCatalogPage';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { TourFilterOption } from '@/types/tourFilterOptions';

interface FilterPlacementPageProps {
    regions: TourFilterOption[];
    travelStyles: TourFilterOption[];
    difficulties: TourFilterOption[];
}

export default function FilterPlacement({
    regions,
    travelStyles,
    difficulties,
}: FilterPlacementPageProps) {
    return (
        <FilterOptionCatalogPage
            pageId="filter-placement"
            title="Filter & Placement"
            description="These lists drive the tours form and the public tours filters."
            icon={Filter}
            defaultType="region"
            catalogs={[
                {
                    type: 'region',
                    title: 'Regions',
                    items: regions,
                    description: 'Used on the tours form and the public region filter.',
                },
                {
                    type: 'travelStyle',
                    title: 'Travel styles',
                    items: travelStyles,
                    description: 'Used on the tours form, public tours filters, and the homepage finder.',
                },
                {
                    type: 'difficulty',
                    title: 'Difficulties',
                    items: difficulties,
                    description: 'Used on the tours form and the public difficulty filter.',
                },
            ]}
        />
    );
}

FilterPlacement.layout = withAdminLayout('Filter & Placement');
