import { AboutCtaSection } from '@/components/sections/about/AboutCtaSection';
import { AboutHero } from '@/components/sections/about/AboutHero';
import { AboutMilestonesSection } from '@/components/sections/about/AboutMilestonesSection';
import { AboutMissionVisionSection } from '@/components/sections/about/AboutMissionVisionSection';
import { AboutPartnersSection } from '@/components/sections/about/AboutPartnersSection';
import { AboutStatsBand } from '@/components/sections/about/AboutStatsBand';
import { AboutStorySection } from '@/components/sections/about/AboutStorySection';
import { AboutTeamSection } from '@/components/sections/about/AboutTeamSection';
import { AboutValuesSection } from '@/components/sections/about/AboutValuesSection';
import { AboutWhatWeDoSection } from '@/components/sections/about/AboutWhatWeDoSection';
import { AboutWhyChooseUsSection } from '@/components/sections/about/AboutWhyChooseUsSection';

export function AboutLanding() {
    return (
        <div className="w-full">
            <AboutHero />
            <AboutStorySection />
            <AboutMissionVisionSection />
            <AboutValuesSection />
            <AboutWhatWeDoSection />
            <AboutWhyChooseUsSection />
            <AboutStatsBand />
            <AboutTeamSection />
            <AboutMilestonesSection />
            <AboutPartnersSection />
            <AboutCtaSection />
        </div>
    );
}
