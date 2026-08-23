import { ArticleDetailBody } from '@/components/sections/articles/ArticleDetailBody';
import { ArticleDetailHero } from '@/components/sections/articles/ArticleDetailHero';
import type { ArticleDetail, ArticleListItem, ArticleRelatedTour } from '@/types/articles';

interface ArticleDetailLandingProps {
    article: ArticleDetail;
    relatedArticles: readonly ArticleListItem[];
    relatedTours: readonly ArticleRelatedTour[];
}

export function ArticleDetailLanding({
    article,
    relatedArticles,
    relatedTours,
}: ArticleDetailLandingProps) {
    return (
        <div className="w-full">
            <ArticleDetailHero article={article} />
            <ArticleDetailBody
                article={article}
                relatedArticles={relatedArticles}
                relatedTours={relatedTours}
            />
        </div>
    );
}
