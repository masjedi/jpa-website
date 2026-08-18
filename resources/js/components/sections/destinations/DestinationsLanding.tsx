import { DestinationsGridSection } from '@/components/sections/destinations/DestinationsGridSection';
import { DestinationsHero } from '@/components/sections/destinations/DestinationsHero';

export function DestinationsLanding() {
    return (
        <div className="w-full">
            <DestinationsHero />
            <DestinationsGridSection />
        </div>
    );
}
