import { Search } from 'lucide-react';
import type { Ref } from 'react';

import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

export interface CatalogSortOption {
    value: string;
    label: string;
}

interface CatalogSearchSortBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    searchAriaLabel: string;
    sortValue: string;
    onSortChange: (value: string) => void;
    sortOptions: readonly CatalogSortOption[];
    sortLabel?: string;
    resultsLabel?: string;
    searchInputRef?: Ref<HTMLInputElement>;
    className?: string;
}

export function CatalogSearchSortBar({
    searchValue,
    onSearchChange,
    searchPlaceholder,
    searchAriaLabel,
    sortValue,
    onSortChange,
    sortOptions,
    sortLabel,
    resultsLabel,
    searchInputRef,
    className,
}: CatalogSearchSortBarProps) {
    const { t } = useTranslations();
    const resolvedSortLabel = sortLabel ?? t('toursPage.filters.sort');

    return (
        <div
            className={cn(
                'rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5',
                className,
            )}
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                    <Search
                        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                    />
                    <input
                        ref={searchInputRef}
                        type="search"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchAriaLabel}
                        className="w-full rounded-full border border-border bg-background py-2.5 ps-9 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                    />
                </div>

                <label className="inline-flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                    <span className="sr-only sm:not-sr-only">{resolvedSortLabel}</span>
                    <select
                        value={sortValue}
                        onChange={(event) => onSortChange(event.target.value)}
                        aria-label={resolvedSortLabel}
                        className="min-w-[9.5rem] rounded-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {resultsLabel ? (
                <p
                    className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground"
                    aria-live="polite"
                >
                    {resultsLabel}
                </p>
            ) : null}
        </div>
    );
}
