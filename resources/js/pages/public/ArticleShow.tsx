import { setLayoutProps } from '@inertiajs/react';
import { useCallback } from 'react';

import { AsyncContent } from '@/components/loading/AsyncContent';
import { PageMeta } from '@/components/public/PageMeta';
import { ArticleDetailLanding } from '@/components/sections/articles/ArticleDetailLanding';
import { ArticleNotFound } from '@/components/sections/articles/ArticleNotFound';
import { SkeletonHero, SkeletonImage } from '@/components/ui/skeleton';
import { loadArticleBySlug } from '@/lib/contentLoaders';
import { PublicLayout } from '@/layouts/PublicLayout';

interface ArticleShowProps {
    articleSlug: string;
}

function ArticleShowSkeleton() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <SkeletonHero />
            <SkeletonImage aspectRatio="aspect-[21/9]" className="mt-8 rounded-2xl" />
        </div>
    );
}

export default function ArticleShow({ articleSlug }: ArticleShowProps) {
    setLayoutProps({ transparentHeader: false });

    const load = useCallback(() => loadArticleBySlug(articleSlug), [articleSlug]);

    return (
        <AsyncContent
            reloadKey={articleSlug}
            load={load}
            loadingFallback={<ArticleShowSkeleton />}
            notFound={
                <>
                    <PageMeta
                        title="Article not found"
                        description="This article may have moved or is no longer published."
                        noIndex
                    />
                    <ArticleNotFound />
                </>
            }
        >
            {(article) => (
                <>
                    <PageMeta
                        title={article.title}
                        description={article.summary}
                        image={article.image}
                    />
                    <ArticleDetailLanding article={article} />
                </>
            )}
        </AsyncContent>
    );
}

ArticleShow.layout = PublicLayout;
