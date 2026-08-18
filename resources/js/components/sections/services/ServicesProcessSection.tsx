import { FadeIn } from '@/components/motion/FadeIn';
import { serviceProcessSteps } from '@/data/servicesData';

export function ServicesProcessSection() {
    return (
        <section className="border-t border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            How it works
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            Inquiry-based planning
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Every service starts with a conversation — not an
                            instant checkout. We confirm details, permits and
                            pricing before you travel.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {serviceProcessSteps.map((step, index) => (
                        <FadeIn key={step.step} delay={index * 0.05}>
                            <article className="relative rounded-2xl border border-border bg-surface p-5 text-start shadow-sm">
                                <span className="font-heading text-3xl font-bold text-secondary/25">
                                    {step.step}
                                </span>
                                <h3 className="font-heading mt-2 text-sm font-semibold text-foreground">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
