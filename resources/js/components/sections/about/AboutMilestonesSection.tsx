import { FadeIn } from '@/components/motion/FadeIn';
import { aboutMilestones } from '@/data/aboutData';

export function AboutMilestonesSection() {
    return (
        <section id="milestones" className="border-t border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Milestones
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            The road so far
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Key moments in our growth — from informal guiding to
                            structured community tourism.
                        </p>
                    </div>
                </FadeIn>

                <ol className="relative mt-10 space-y-8 border-l-2 border-border ps-6 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0 lg:border-l-0 lg:border-t-2 lg:ps-0">
                    {aboutMilestones.map((milestone, index) => (
                        <li key={milestone.year} className="relative lg:pt-6">
                            <span
                                aria-hidden
                                className="absolute -start-[31px] top-1 size-3 rounded-full border-2 border-secondary bg-background lg:-top-[7px] lg:start-0"
                            />
                            <FadeIn delay={index * 0.05}>
                                <p className="font-heading text-lg font-bold text-accent">
                                    {milestone.year}
                                </p>
                                <p className="font-heading mt-1 text-sm font-semibold text-foreground">
                                    {milestone.title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {milestone.description}
                                </p>
                            </FadeIn>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
