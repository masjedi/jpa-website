import { Eye, Target } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { aboutMissionVision } from '@/data/aboutData';

export function AboutMissionVisionSection() {
    return (
        <section
            id="mission"
            aria-labelledby="mission-vision-heading"
            className="relative overflow-hidden bg-brand-surface py-14 text-brand-on-surface sm:py-16"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,115,115,0.28)_0%,transparent_50%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(215,162,58,0.1)_0%,transparent_40%)]"
            />

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                            JPA
                        </p>
                        <h2
                            id="mission-vision-heading"
                            className="font-heading mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                        >
                            Our Mission &amp; Vision
                        </h2>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <FadeIn delay={0.05}>
                        <article className="rounded-2xl border border-brand-on-surface/10 bg-brand-on-surface/5 p-6 sm:p-8">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                                <Target className="size-6" aria-hidden />
                            </div>
                            <h3 className="font-heading mt-5 text-xl font-semibold">
                                {aboutMissionVision.mission.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/75 sm:text-base">
                                {aboutMissionVision.mission.description}
                            </p>
                        </article>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <article className="rounded-2xl border border-brand-on-surface/10 bg-brand-on-surface/5 p-6 sm:p-8">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                                <Eye className="size-6" aria-hidden />
                            </div>
                            <h3 className="font-heading mt-5 text-xl font-semibold">
                                {aboutMissionVision.vision.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/75 sm:text-base">
                                {aboutMissionVision.vision.description}
                            </p>
                        </article>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
