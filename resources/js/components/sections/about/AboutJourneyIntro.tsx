import { FadeIn } from '@/components/motion/FadeIn';
import { aboutPage } from '@/data/aboutData';

export function AboutJourneyIntro() {
    return (
        <section id="story" className="bg-background pb-8 pt-28 sm:pb-10 sm:pt-32 lg:pt-36">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                <FadeIn>
                    <p className="text-sm font-medium text-muted-foreground">
                        {aboutPage.intro.eyebrow}
                    </p>
                    <h2 className="font-heading mt-3 text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
                        {aboutPage.intro.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {aboutPage.intro.description}
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}
