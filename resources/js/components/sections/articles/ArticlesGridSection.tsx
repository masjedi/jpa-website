import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';
import { articleShowHref } from '@/components/public/navigation';
import { stripHtml } from '@/lib/richText';
import type { ArticleCategory, ArticleListItem } from '@/types/articles';

const PAGE_SIZE = 6;

const articleCategories: readonly ArticleCategory[] = [
    'Travel tips',
    'Culture',
    'Itineraries',
    'Safety',
    'Heritage',
    'Photography',
];

function EditorialCard({
    article,
    delay = 0,
    wide = false,
}: {
    article: ArticleListItem;
    delay?: number;
    wide?: boolean;
}) {
    return (
        <FadeIn delay={delay} className={wide ? 'sm:col-span-2' : undefined}>
            <Link
                href={articleShowHref(article.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/25 hover:shadow-md"
            >
                <div
                    className={`relative overflow-hidden bg-surface-muted ${
                        wide ? 'aspect-[21/9] sm:aspect-[2.4/1]' : 'aspect-[4/5]'
                    }`}
                >
                    <img
                        src={article.image}
                        alt=""
                        width={wide ? 960 : 480}
                        height={wide ? 400 : 600}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-md bg-black/45 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                        {article.category}
                    </span>
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <Clock className="size-3" aria-hidden />
                        {article.readingTimeMinutes} min
                    </span>
                </div>

                <div className={`flex flex-1 flex-col p-5 ${wide ? 'sm:p-6' : ''}`}>
                    <time
                        dateTime={article.date}
                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                        {article.date}
                    </time>
                    <h3
                        className={`font-heading mt-2 font-semibold leading-snug text-foreground ${
                            wide ? 'text-xl sm:text-2xl' : 'text-base'
                        }`}
                    >
                        {article.title}
                    </h3>
                    <div
                        aria-hidden
                        className="mt-3 h-0.5 w-8 rounded-full bg-accent/80 transition-all duration-300 group-hover:w-14"
                    />
                    <p
                        className={`mt-3 leading-relaxed text-muted-foreground ${
                            wide ? 'text-sm line-clamp-2 sm:text-base' : 'text-xs line-clamp-3 sm:text-sm'
                        }`}
                    >
                        {article.summary}
                    </p>
                    <p className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold text-secondary">
                        <span>Read article</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </p>
                </div>
            </Link>
        </FadeIn>
    );
}

interface ArticlesGridSectionProps {
    articles: readonly ArticleListItem[];
    featuredSlug?: string;
}

export function ArticlesGridSection({ articles, featuredSlug }: ArticlesGridSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | ArticleCategory>(
        'all',
    );
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const categories = useMemo(
        () => [
            { value: 'all' as const, label: 'All topics' },
            ...articleCategories.map((category) => ({
                value: category,
                label: category,
            })),
        ],
        [],
    );

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            if (
                article.slug === featuredSlug &&
                selectedCategory === 'all' &&
                !searchQuery.trim()
            ) {
                return false;
            }

            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const haystack = [
                    article.title,
                    article.summary,
                    article.category,
                    article.author.name,
                    stripHtml('content' in article ? String(article.content ?? '') : ''),
                ]
                    .join(' ')
                    .toLowerCase();

                if (!haystack.includes(query)) {
                    return false;
                }
            }

            if (
                selectedCategory !== 'all' &&
                article.category !== selectedCategory
            ) {
                return false;
            }

            return true;
        });
    }, [articles, featuredSlug, searchQuery, selectedCategory]);

    const visibleArticles = filteredArticles.slice(0, visibleCount);
    const hasMore = visibleCount < filteredArticles.length;
    const hasActiveFilters =
        searchQuery.trim() !== '' || selectedCategory !== 'all';

    return (
        <section id="article-grid" className="bg-surface-muted/40 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-4 text-start sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                Library
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                Latest from our team
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {filteredArticles.length} article
                            {filteredArticles.length === 1 ? '' : 's'}
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.05} className="mt-6 space-y-4">
                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(event.target.value);
                                setVisibleCount(PAGE_SIZE);
                            }}
                            placeholder="Search articles…"
                            aria-label="Search articles"
                            className="w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                type="button"
                                onClick={() => {
                                    setSelectedCategory(category.value);
                                    setVisibleCount(PAGE_SIZE);
                                }}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                                    selectedCategory === category.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border border-border bg-surface text-foreground hover:bg-surface-muted'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setVisibleCount(PAGE_SIZE);
                                }}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-secondary hover:underline"
                            >
                                <RotateCcw className="size-3.5" aria-hidden />
                                Clear
                            </button>
                        ) : null}
                    </div>
                </FadeIn>

                {visibleArticles.length > 0 ? (
                    <>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleArticles.map((article, index) => (
                                <EditorialCard
                                    key={article.id}
                                    article={article}
                                    delay={index * 0.04}
                                    wide={
                                        index === 0 &&
                                        !hasActiveFilters &&
                                        visibleArticles.length > 2
                                    }
                                />
                            ))}
                        </div>

                        {hasMore ? (
                            <FadeIn className="mt-8 text-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVisibleCount(
                                            (count) => count + PAGE_SIZE,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Load more articles
                                </button>
                            </FadeIn>
                        ) : null}
                    </>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                        <Search
                            className="mx-auto size-8 text-muted-foreground"
                            aria-hidden
                        />
                        <h3 className="font-heading mt-3 text-lg font-semibold text-foreground">
                            {articles.length === 0
                                ? 'No published articles yet'
                                : 'No articles found'}
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            {articles.length === 0
                                ? 'Publish articles from the admin dashboard to populate this library.'
                                : 'Try a different search term or clear the filters.'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
