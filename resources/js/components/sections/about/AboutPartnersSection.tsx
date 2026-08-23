import { Award, Handshake, Landmark, ShieldCheck } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { aboutPartners } from '@/data/aboutData';

const categoryIcons = {
    'Industry affiliation': Landmark,
    'Artisan network': Handshake,
    'Community tourism': Handshake,
    'Guide certification': ShieldCheck,
    'Responsible travel': ShieldCheck,
    'Cultural partner': Award,
} as const;

export function AboutPartnersSection() {
    return (
        <section
            id="partners"
            className="border-t border-border bg-surface-muted/30 py-12 sm:py-16"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Partners &amp; certifications
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            Trusted relationships on the ground
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            We work with vetted partners — from craft cooperatives to
                            safety trainers — so every journey is supported locally.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {aboutPartners.map((partner, index) => {
                        const Icon =
                            categoryIcons[
                                partner.category as keyof typeof categoryIcons
                            ] ?? Award;

                        return (
                            <FadeIn key={partner.name} delay={index * 0.04}>
                                <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 text-start shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                            <Icon className="size-5" aria-hidden />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                                                {partner.category}
                                            </p>
                                            <h3 className="font-heading mt-0.5 text-base font-semibold text-foreground">
                                                {partner.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {partner.description}
                                    </p>
                                </article>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
