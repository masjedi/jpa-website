import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { FadeIn, FadeInOnMount } from '@/components/motion/FadeIn';

interface LegalDocumentProps {
    title: string;
    eyebrow: string;
    intro: string;
    children: ReactNode;
}

export function LegalDocument({ title, eyebrow, intro, children }: LegalDocumentProps) {
    return (
        <>
            <section className="relative overflow-hidden bg-brand-surface text-brand-on-surface">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,115,115,0.35)_0%,transparent_45%)]"
                />
                <div className="relative z-10 mx-auto max-w-3xl px-4 pb-14 pt-32 text-center sm:px-6 lg:pb-16 lg:pt-36">
                    <FadeInOnMount>
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center justify-center gap-2 text-xs font-medium text-brand-on-surface/65"
                        >
                            <Link
                                href="/"
                                className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Home
                            </Link>
                            <ChevronRight className="size-3.5 opacity-50 rtl:rotate-180" aria-hidden />
                            <span className="text-brand-on-surface" aria-current="page">
                                {title}
                            </span>
                        </nav>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                            {eyebrow}
                        </p>
                        <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl">
                            {title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                            {intro}
                        </p>
                    </FadeInOnMount>
                </div>
            </section>

            <section className="bg-background py-12 sm:py-16">
                <FadeIn>
                    <div className="mx-auto max-w-3xl space-y-8 px-4 text-start sm:px-6 lg:px-8">
                        {children}
                    </div>
                </FadeIn>
            </section>
        </>
    );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {children}
            </div>
        </section>
    );
}
