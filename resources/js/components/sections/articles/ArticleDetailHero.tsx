import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { FadeInOnMount } from '@/components/motion/FadeIn';
import type { ArticleDetail } from '@/types/articles';

interface ArticleDetailHeroProps {
    article: ArticleDetail;
}

export function ArticleDetailHero({ article }: ArticleDetailHeroProps) {
    return (
        <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <FadeInOnMount>
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Home
                        </Link>
                        <span aria-hidden>/</span>
                        <Link
                            href="/articles"
                            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Articles
                        </Link>
                        <span aria-hidden>/</span>
                        <span className="line-clamp-1 text-foreground" aria-current="page">
                            {article.title}
                        </span>
                    </nav>

                    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div className="text-start">
                            <span className="rounded-md bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-secondary">
                                {article.category}
                            </span>

                            <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                {article.title}
                            </h1>

                            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                                {article.summary}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="size-4 text-secondary" aria-hidden />
                                    <time dateTime={article.date}>{article.date}</time>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="size-4 text-secondary" aria-hidden />
                                    {article.readingTimeMinutes} min read
                                </span>
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                                {article.author.avatar ? (
                                    <img
                                        src={article.author.avatar}
                                        alt=""
                                        className="size-10 rounded-full object-cover ring-2 ring-border"
                                    />
                                ) : (
                                    <div className="size-10 rounded-full bg-primary/10" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {article.author.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {article.author.role}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/articles"
                                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <ArrowLeft className="size-4" aria-hidden />
                                All articles
                            </Link>
                        </div>

                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-muted shadow-sm">
                            <img
                                src={article.image}
                                alt={article.title}
                                width={1200}
                                height={750}
                                className="size-full object-cover"
                                decoding="async"
                                fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                        </div>
                    </div>
                </FadeInOnMount>
            </div>
        </section>
    );
}
