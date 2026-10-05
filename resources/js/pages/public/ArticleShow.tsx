import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ArticleDetailLanding } from '@/components/sections/articles/ArticleDetailLanding';
import type { ArticleDetail, ArticleListItem, ArticleRelatedTour } from '@/types/articles';
import { PublicLayout } from '@/layouts/PublicLayout';

interface ArticleShowProps {
    article: ArticleDetail;
    relatedArticles: ArticleListItem[];
    relatedTours: ArticleRelatedTour[];
}

export default function ArticleShow({
    article,
    relatedArticles,
    relatedTours,
}: ArticleShowProps) {
    setLayoutProps({ transparentHeader: false });

    return (
        <>
            <PageMeta />
            <ArticleDetailLanding
                article={article}
                relatedArticles={relatedArticles}
                relatedTours={relatedTours}
            />
        </>
    );
}

ArticleShow.layout = PublicLayout;
