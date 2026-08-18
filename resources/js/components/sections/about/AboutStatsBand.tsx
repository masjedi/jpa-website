import { FadeIn } from '@/components/motion/FadeIn';
import { aboutStats } from '@/data/aboutData';

export function AboutStatsBand() {
    return (
        <section className="relative overflow-hidden bg-brand-surface py-12 text-brand-on-surface sm:py-14">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,115,115,0.3)_0%,transparent_60%)]"
            />
            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
                    {aboutStats.map((stat, index) => (
                        <FadeIn key={stat.label} delay={index * 0.06}>
                            <div>
                                <p className="font-heading text-4xl font-bold tracking-tight text-brand-on-surface sm:text-5xl">
                                    {stat.value}
                                </p>
                                <div
                                    aria-hidden
                                    className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-accent"
                                />
                                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-on-surface/70">
                                    {stat.label}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
