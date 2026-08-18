import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { FadeInOnMount } from '@/components/motion/FadeIn';

export function ArticleNotFound() {
    return (
        <section className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
                <FadeInOnMount>
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Not found
                    </p>
                    <h1 className="font-heading mt-3 text-3xl font-semibold text-foreground">
                        Article not found
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        This article may have moved or is not yet published.
                    </p>
                    <Link
                        href="/articles"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                        Back to articles
                    </Link>
                </FadeInOnMount>
            </div>
        </section>
    );
}
