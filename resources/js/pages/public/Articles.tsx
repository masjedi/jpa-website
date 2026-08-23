import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ArticlesLanding } from '@/components/sections/articles/ArticlesLanding';
import type { ArticleListItem } from '@/types/articles';
import { PublicLayout } from '@/layouts/PublicLayout';

interface ArticlesPageProps {
    articles?: readonly ArticleListItem[];
}

export default function Articles({ articles = [] }: ArticlesPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Articles"
                description="Travel notes, cultural guides and practical advice for visiting Afghanistan — from the Journey to Peace team."
            />
            <ArticlesLanding articles={articles} />
        </>
    );
}

Articles.layout = PublicLayout;
