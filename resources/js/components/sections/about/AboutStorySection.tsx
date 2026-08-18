import { FadeIn } from '@/components/motion/FadeIn';
import { aboutMilestones, aboutStory } from '@/data/aboutData';

export function AboutStorySection() {
    return (
        <section className="border-b border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-2">
                    <FadeIn>
                        <div className="text-start">
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                {aboutStory.eyebrow}
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                {aboutStory.title}
                            </h2>
                            <div className="mt-5 space-y-4">
                                {aboutStory.paragraphs.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.08}>
                        <div className="relative">
                            <div
                                aria-hidden
                                className="absolute -right-3 -top-3 size-full rounded-3xl border-2 border-accent/40"
                            />
                            <div className="relative overflow-hidden rounded-3xl bg-surface-muted shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                                    alt="Hindu Kush mountain landscape in Afghanistan"
                                    className="aspect-[4/3] size-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-4 w-40 overflow-hidden rounded-2xl border-4 border-background shadow-lg sm:-left-8 sm:w-52">
                                <img
                                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
                                    alt="Shared tea with local hosts"
                                    className="aspect-[4/3] size-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>

                <div className="mt-20 sm:mt-24">
                    <FadeIn>
                        <h3 className="font-heading text-start text-xl font-semibold text-foreground sm:text-2xl">
                            The road so far
                        </h3>
                    </FadeIn>

                    <ol className="relative mt-8 space-y-8 border-l-2 border-border pl-6 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0 lg:border-l-0 lg:border-t-2 lg:pl-0">
                        {aboutMilestones.map((milestone, index) => (
                            <li key={milestone.year} className="relative lg:pt-6">
                                <span
                                    aria-hidden
                                    className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-secondary bg-background lg:-top-[7px] lg:left-0"
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
            </div>
        </section>
    );
}
