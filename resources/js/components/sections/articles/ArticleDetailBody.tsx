import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Link2 } from 'lucide-react';
import { useState } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';
import { articleShowHref } from '@/components/public/navigation';
import { isRichTextHtml } from '@/lib/richText';
import type { ArticleDetail, ArticleListItem, ArticleRelatedTour } from '@/types/articles';

interface ArticleDetailBodyProps {
    article: ArticleDetail;
    relatedArticles: readonly ArticleListItem[];
    relatedTours: readonly ArticleRelatedTour[];
}

export function ArticleDetailBody({
    article,
    relatedArticles,
    relatedTours,
}: ArticleDetailBodyProps) {
    const [copied, setCopied] = useState(false);
    const usesRichContent = Boolean(article.content && isRichTextHtml(article.content));

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <>
            <section className="bg-background py-10 sm:py-14">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <article className="space-y-10 text-start lg:col-span-2">
                        {usesRichContent ? (
                            <FadeIn>
                                <div
                                    className="rich-text-content text-sm leading-relaxed text-muted-foreground sm:text-base [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-5"
                                    dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
                                />
                            </FadeIn>
                        ) : (
                            article.sections.map((section, index) => (
                                <FadeIn key={section.id} delay={index * 0.04}>
                                    <div id={section.id}>
                                        <h2 className="font-heading text-xl font-semibold text-foreground">
                                            {section.heading}
                                        </h2>
                                        <div className="mt-4 space-y-4">
                                            {section.paragraphs.map((paragraph) => (
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
                            ))
                        )}
                    </article>

                    <aside className="lg:col-span-1">
                        <FadeIn delay={0.06}>
                            <div className="sticky top-28 space-y-5">
                                {!usesRichContent ? (
                                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                        <h2 className="font-heading text-sm font-semibold text-foreground">
                                            In this article
                                        </h2>
                                        <nav aria-label="Table of contents" className="mt-3">
                                            <ul className="space-y-2">
                                                {article.sections.map((section) => (
                                                    <li key={section.id}>
                                                        <a
                                                            href={`#${section.id}`}
                                                            className="text-sm text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                                        >
                                                            {section.heading}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                ) : null}

                                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                    <h2 className="font-heading text-sm font-semibold text-foreground">
                                        Share
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        <Link2 className="size-4 text-secondary" aria-hidden />
                                        {copied ? 'Link copied' : 'Copy link'}
                                    </button>
                                </div>

                                {relatedTours.length > 0 ? (
                                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                        <h2 className="font-heading text-sm font-semibold text-foreground">
                                            Related tours
                                        </h2>
                                        <ul className="mt-3 space-y-3">
                                            {relatedTours.map((tour) => (
                                                <li key={tour.id}>
                                                    <Link
                                                        href={tour.href}
                                                        className="group block rounded-xl border border-border p-3 transition-colors hover:border-secondary/30 hover:bg-surface-muted"
                                                    >
                                                        <p className="font-heading text-sm font-semibold text-foreground">
                                                            {tour.title}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {tour.duration}
                                                        </p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/tours"
                                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                                        >
                                            Browse all tours
                                            <ArrowRight className="size-3.5" aria-hidden />
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        </FadeIn>
                    </aside>
                </div>
            </section>

            {relatedArticles.length > 0 ? (
                <section className="border-t border-border bg-surface-muted/40 py-12 sm:py-14">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <FadeIn>
                            <h2 className="font-heading text-start text-2xl font-semibold text-foreground">
                                Continue reading
                            </h2>
                        </FadeIn>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedArticles.map((related, index) => (
                                <FadeIn key={related.id} delay={index * 0.05}>
                                    <Link
                                        href={articleShowHref(related.slug)}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-start shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                                            <img
                                                src={related.image}
                                                alt=""
                                                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                loading="lazy"
                                            />
                                            <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white">
                                                {related.category}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <time
                                                dateTime={related.date}
                                                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                                            >
                                                {related.date}
                                            </time>
                                            <h3 className="font-heading mt-2 text-base font-semibold text-foreground">
                                                {related.title}
                                            </h3>
                                            <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">
                                                {related.summary}
                                            </p>
                                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                                                Read article
                                                <ArrowRight className="size-3.5" aria-hidden />
                                            </span>
                                        </div>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="border-t border-border bg-background py-10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
                            <div className="text-start">
                                <h2 className="font-heading text-lg font-semibold text-foreground">
                                    Planning a trip?
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Send a booking inquiry and we&apos;ll reply with a
                                    tailored quotation — no instant confirmation.
                                </p>
                            </div>
                            <a
                                href="#contact"
                                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <Check className="size-4" aria-hidden />
                                Send booking request
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </>
    );
}
