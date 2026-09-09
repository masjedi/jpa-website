import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { FadeIn, FadeInOnMount } from '@/components/motion/FadeIn';
import type { LegalDocumentContent } from '@/types/legalPage';

interface LegalDocumentProps {
    document: LegalDocumentContent;
}

export function LegalDocument({ document }: LegalDocumentProps) {
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
                                {document.title}
                            </span>
                        </nav>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                            {document.eyebrow}
                        </p>
                        <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-brand-on-surface sm:text-4xl">
                            {document.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                            {document.intro}
                        </p>
                    </FadeInOnMount>
                </div>
            </section>

            <section className="bg-background py-12 sm:py-16">
                <FadeIn>
                    <div className="mx-auto max-w-3xl space-y-8 px-4 text-start sm:px-6 lg:px-8">
                        {document.sections.map((section) => (
                            <section key={`${section.title}-${section.body.slice(0, 24)}`}>
                                <h2 className="font-heading text-xl font-semibold text-foreground">
                                    {section.title}
                                </h2>
                                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                                    <p>
                                        {section.body}
                                        {section.linkHref && section.linkLabel ? (
                                            <>
                                                {' '}
                                                <Link
                                                    href={section.linkHref}
                                                    className="font-medium text-secondary underline-offset-4 hover:underline"
                                                >
                                                    {section.linkLabel}
                                                </Link>
                                                .
                                            </>
                                        ) : null}
                                    </p>
                                </div>
                            </section>
                        ))}
                    </div>
                </FadeIn>
            </section>
        </>
    );
}
