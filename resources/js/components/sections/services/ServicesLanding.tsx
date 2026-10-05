import { ServicesFeaturedSection } from '@/components/sections/services/ServicesFeaturedSection';
import { ServicesHero } from '@/components/sections/services/ServicesHero';
import { ServicesImpactSection } from '@/components/sections/services/ServicesImpactSection';
import { ServicesListSection } from '@/components/sections/services/ServicesListSection';
import { ServicesProcessSection } from '@/components/sections/services/ServicesProcessSection';
import type { PublicServiceOffering } from '@/types/services';

interface ServicesLandingProps {
    offerings: readonly PublicServiceOffering[];
}

export function ServicesLanding({ offerings }: ServicesLandingProps) {
    return (
        <div className="w-full">
            <ServicesHero />
            <ServicesFeaturedSection offerings={offerings} />
            <ServicesListSection offerings={offerings} />
            <ServicesProcessSection />
            <ServicesImpactSection />
        </div>
    );
}
