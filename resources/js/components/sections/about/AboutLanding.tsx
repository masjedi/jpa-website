import { AboutHero } from '@/components/sections/about/AboutHero';
import { AboutStatsBand } from '@/components/sections/about/AboutStatsBand';
import { AboutStorySection } from '@/components/sections/about/AboutStorySection';
import { AboutTeamSection } from '@/components/sections/about/AboutTeamSection';
import { AboutValuesSection } from '@/components/sections/about/AboutValuesSection';

export function AboutLanding() {
    return (
        <div className="w-full">
            <AboutHero />
            <AboutStorySection />
            <AboutStatsBand />
            <AboutValuesSection />
            <AboutTeamSection />
        </div>
    );
}
