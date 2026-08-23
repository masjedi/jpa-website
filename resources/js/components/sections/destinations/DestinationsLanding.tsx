import { DestinationsGridSection } from '@/components/sections/destinations/DestinationsGridSection';
import { DestinationsHero } from '@/components/sections/destinations/DestinationsHero';
import type { Destination } from '@/types/destinations';

interface DestinationsLandingProps {
    destinations: readonly Destination[];
}

export function DestinationsLanding({ destinations }: DestinationsLandingProps) {
    return (
        <div className="w-full">
            <DestinationsHero />
            <DestinationsGridSection destinations={destinations} />
        </div>
    );
}
