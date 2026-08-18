import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ArticleDetailLanding } from '@/components/sections/articles/ArticleDetailLanding';
import { ArticleNotFound } from '@/components/sections/articles/ArticleNotFound';
import { getArticleBySlug } from '@/data/articlesData';
import { PublicLayout } from '@/layouts/PublicLayout';

interface ArticleShowProps {
    articleSlug: string;
}

export default function ArticleShow({ articleSlug }: ArticleShowProps) {
    setLayoutProps({ transparentHeader: false });

    const article = getArticleBySlug(articleSlug);

    if (!article) {
        return (
            <>
                <PageMeta
                    title="Article not found"
                    description="This article may have moved or is no longer published."
                    noIndex
                />
                <ArticleNotFound />
            </>
        );
    }

    return (
        <>
            <PageMeta title={article.title} description={article.summary} image={article.image} />
            <ArticleDetailLanding article={article} />
        </>
    );
}

ArticleShow.layout = PublicLayout;
