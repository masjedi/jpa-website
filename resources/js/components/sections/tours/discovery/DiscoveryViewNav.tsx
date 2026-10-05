import { Link } from '@inertiajs/react';

import {
    type DiscoveryView,
    discoveryViewHref,
} from '@/components/sections/tours/discovery/discoveryQuery';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface DiscoveryViewNavProps {
    view: DiscoveryView;
}

export function DiscoveryViewNav({ view }: DiscoveryViewNavProps) {
    const { t } = useTranslations();

    const items: { id: DiscoveryView; label: string }[] = [
        { id: 'tours', label: t('toursPage.views.allTours') },
        { id: 'packages', label: t('toursPage.views.packages') },
        { id: 'destinations', label: t('toursPage.views.destinations') },
    ];

    return (
        <nav
            aria-label={t('toursPage.views.navLabel')}
            className="border-b border-border bg-background/95 backdrop-blur-sm"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div
                    role="tablist"
                    aria-label={t('toursPage.views.navLabel')}
                    className="flex gap-1 overflow-x-auto py-3"
                >
                    {items.map((item) => {
                        const selected = item.id === view;

                        return (
                            <Link
                                key={item.id}
                                href={discoveryViewHref(item.id)}
                                role="tab"
                                aria-selected={selected}
                                className={cn(
                                    'inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                    selected
                                        ? 'bg-secondary text-secondary-foreground shadow-sm'
                                        : 'bg-surface-muted/60 text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
