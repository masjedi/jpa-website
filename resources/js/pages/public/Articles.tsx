import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ArticlesLanding } from '@/components/sections/articles/ArticlesLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Articles() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Articles"
                description="Travel notes, cultural guides and practical advice for visiting Afghanistan — from the Journey to Peace team."
            />
            <ArticlesLanding />
        </>
    );
}

Articles.layout = PublicLayout;
