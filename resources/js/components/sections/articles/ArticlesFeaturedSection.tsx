import { Link } from '@inertiajs/react';
import { ArrowRight, Clock } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { articleShowHref } from '@/components/public/navigation';
import { BorderGlow } from '@/components/react-bits/BorderGlow/BorderGlow';
import type { ArticleListItem } from '@/types/articles';

interface ArticlesFeaturedSectionProps {
    featured: ArticleListItem | null;
}

export function ArticlesFeaturedSection({ featured }: ArticlesFeaturedSectionProps) {
    if (!featured) {
        return null;
    }

    return (
        <section className="border-b border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Editor&apos;s pick
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            Featured story
                        </h2>
                    </div>
                </FadeIn>

                <FadeIn delay={0.06} className="mt-8">
                    <BorderGlow
                        className="overflow-hidden"
                        backgroundColor="var(--surface)"
                        borderRadius={24}
                        colors={['#0E7373', '#163B5C', '#D7A23A']}
                        glowColor="182 78 26"
                        edgeSensitivity={20}
                        animated={false}
                    >
                        <article className="grid overflow-hidden rounded-3xl border border-border bg-surface lg:grid-cols-5">
                            <Link
                                href={articleShowHref(featured.slug)}
                                className="group relative block aspect-[16/10] overflow-hidden bg-surface-muted lg:col-span-3 lg:aspect-auto lg:min-h-[22rem]"
                            >
                                <img
                                    src={featured.image}
                                    alt=""
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20" />
                                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                                    {featured.category}
                                </span>
                            </Link>

                            <div className="flex flex-col justify-center p-6 text-start sm:p-8 lg:col-span-2">
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <time dateTime={featured.date}>{featured.date}</time>
                                    <span aria-hidden>·</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="size-3.5 text-secondary" aria-hidden />
                                        {featured.readingTimeMinutes} min read
                                    </span>
                                </div>

                                <h3 className="font-heading mt-4 text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
                                    <Link
                                        href={articleShowHref(featured.slug)}
                                        className="transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        {featured.title}
                                    </Link>
                                </h3>

                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    {featured.summary}
                                </p>

                                <p className="mt-5 text-sm text-muted-foreground">
                                    By{' '}
                                    <span className="font-medium text-foreground">
                                        {featured.author.name}
                                    </span>
                                    <span className="hidden sm:inline">
                                        {' '}
                                        · {featured.author.role}
                                    </span>
                                </p>

                                <Link
                                    href={articleShowHref(featured.slug)}
                                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Read article
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                </Link>
                            </div>
                        </article>
                    </BorderGlow>
                </FadeIn>
            </div>
        </section>
    );
}
