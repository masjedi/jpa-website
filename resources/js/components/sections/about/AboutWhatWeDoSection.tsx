import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { aboutWhatWeDo } from '@/data/aboutData';

export function AboutWhatWeDoSection() {
    return (
        <section id="what-we-do" className="border-b border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-4 text-start sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                What we do
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                End-to-end journey support
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                From the first inquiry to your return flight — we coordinate
                                the details so you can focus on the experience.
                            </p>
                        </div>
                        <Link
                            href="/services"
                            prefetch="hover"
                            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            View all services
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {aboutWhatWeDo.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <FadeIn key={item.title} delay={index * 0.04}>
                                <article className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/25 hover:shadow-md">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                                        <Icon className="size-5" aria-hidden />
                                    </div>
                                    <div className="min-w-0 text-start">
                                        <h3 className="font-heading text-base font-semibold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
