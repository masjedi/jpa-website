import { FadeIn } from '@/components/motion/FadeIn';
import { aboutStory } from '@/data/aboutData';

export function AboutStorySection() {
    return (
        <section id="story" className="border-b border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
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
                                className="absolute -end-3 -top-3 size-full rounded-3xl border-2 border-accent/40"
                            />
                            <div className="relative overflow-hidden rounded-3xl bg-surface-muted shadow-sm">
                                <img
                                    src={aboutStory.images.primary.src}
                                    alt={aboutStory.images.primary.alt}
                                    className="aspect-[4/3] size-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute -bottom-6 -start-4 w-40 overflow-hidden rounded-2xl border-4 border-background shadow-lg sm:-start-8 sm:w-52">
                                <img
                                    src={aboutStory.images.secondary.src}
                                    alt={aboutStory.images.secondary.alt}
                                    className="aspect-[4/3] size-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
