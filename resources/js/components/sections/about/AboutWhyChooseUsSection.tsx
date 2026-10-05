import { FadeIn } from '@/components/motion/FadeIn';
import { aboutWhyChooseUs } from '@/data/aboutData';

export function AboutWhyChooseUsSection() {
    return (
        <section
            id="why-us"
            aria-labelledby="why-us-heading"
            className="bg-surface-muted/40 py-12 sm:py-16"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Why choose us
                        </p>
                        <h2
                            id="why-us-heading"
                            className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl"
                        >
                            The difference is on the ground
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            We are not a booking platform. We are a small Afghan team
                            that plans, guides and stands behind every journey.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    {aboutWhyChooseUs.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <FadeIn key={item.title} delay={index * 0.05}>
                                <article className="group flex h-full items-start gap-5 rounded-2xl border border-border bg-surface p-6 text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-md">
                                    <div className="relative shrink-0">
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                                            <Icon className="size-7" aria-hidden />
                                        </div>
                                        <span
                                            aria-hidden
                                            className="font-heading absolute -bottom-1.5 -end-1.5 flex size-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground"
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </article>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
