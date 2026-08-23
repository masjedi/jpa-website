import { ArticlesFeaturedSection } from '@/components/sections/articles/ArticlesFeaturedSection';
import { ArticlesGridSection } from '@/components/sections/articles/ArticlesGridSection';
import { ArticlesHero } from '@/components/sections/articles/ArticlesHero';
import type { ArticleListItem } from '@/types/articles';

interface ArticlesLandingProps {
    articles: readonly ArticleListItem[];
}

export function ArticlesLanding({ articles }: ArticlesLandingProps) {
    const featured = articles.find((article) => article.isFeatured) ?? null;

    return (
        <div className="w-full">
            <ArticlesHero />
            <ArticlesFeaturedSection featured={featured} />
            <ArticlesGridSection articles={articles} featuredSlug={featured?.slug} />
        </div>
    );
}
