import { ServicesFeaturedSection } from '@/components/sections/services/ServicesFeaturedSection';
import { ServicesHero } from '@/components/sections/services/ServicesHero';
import { ServicesImpactSection } from '@/components/sections/services/ServicesImpactSection';
import { ServicesListSection } from '@/components/sections/services/ServicesListSection';
import { ServicesProcessSection } from '@/components/sections/services/ServicesProcessSection';

export function ServicesLanding() {
    return (
        <div className="w-full">
            <ServicesHero />
            <ServicesFeaturedSection />
            <ServicesListSection />
            <ServicesProcessSection />
            <ServicesImpactSection />
        </div>
    );
}
