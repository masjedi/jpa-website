import { ArticlesFeaturedSection } from '@/components/sections/articles/ArticlesFeaturedSection';
import { ArticlesGridSection } from '@/components/sections/articles/ArticlesGridSection';
import { ArticlesHero } from '@/components/sections/articles/ArticlesHero';

export function ArticlesLanding() {
    return (
        <div className="w-full">
            <ArticlesHero />
            <ArticlesFeaturedSection />
            <ArticlesGridSection />
        </div>
    );
}
