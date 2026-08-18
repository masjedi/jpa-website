import { ArticleDetailBody } from '@/components/sections/articles/ArticleDetailBody';
import { ArticleDetailHero } from '@/components/sections/articles/ArticleDetailHero';
import type { ArticleDetail } from '@/types/articles';

interface ArticleDetailLandingProps {
    article: ArticleDetail;
}

export function ArticleDetailLanding({ article }: ArticleDetailLandingProps) {
    return (
        <div className="w-full">
            <ArticleDetailHero article={article} />
            <ArticleDetailBody article={article} />
        </div>
    );
}
