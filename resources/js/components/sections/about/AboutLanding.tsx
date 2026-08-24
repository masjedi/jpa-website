import { AboutCtaSection } from '@/components/sections/about/AboutCtaSection';
import { AboutJourneyIntro } from '@/components/sections/about/AboutJourneyIntro';
import { AboutJourneyPath } from '@/components/sections/about/AboutJourneyPath';
import { AboutMissionVisionSection } from '@/components/sections/about/AboutMissionVisionSection';

export function AboutLanding() {
    return (
        <div className="w-full">
            <AboutJourneyIntro />
            <AboutMissionVisionSection />
            <AboutJourneyPath />
            <AboutCtaSection />
        </div>
    );
}
