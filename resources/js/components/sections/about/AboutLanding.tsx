import { AboutCtaSection } from '@/components/sections/about/AboutCtaSection';
import { AboutJourneyIntro } from '@/components/sections/about/AboutJourneyIntro';
import { AboutJourneyPath } from '@/components/sections/about/AboutJourneyPath';
import { AboutMissionVisionSection } from '@/components/sections/about/AboutMissionVisionSection';
import type { AboutPageContent, PublicAboutJourneyStep } from '@/types/aboutPage';

interface AboutLandingProps {
    content: AboutPageContent;
    journeySteps: readonly PublicAboutJourneyStep[];
}

export function AboutLanding({ content, journeySteps }: AboutLandingProps) {
    return (
        <div className="w-full">
            <AboutJourneyIntro intro={content.intro} />
            <AboutMissionVisionSection
                missionSection={content.missionSection}
                missionVision={content.missionVision}
            />
            <AboutJourneyPath steps={journeySteps} />
            <AboutCtaSection cta={content.cta} />
        </div>
    );
}
