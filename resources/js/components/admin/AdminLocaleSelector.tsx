import { usePage } from '@inertiajs/react';

import { cn } from '@/lib/utils';
import type { LocaleCode } from '@/types/locale';

interface AdminLocaleSelectorProps {
    activeLocale: LocaleCode;
    completion: Record<LocaleCode, boolean>;
    onChange: (locale: LocaleCode) => void;
    disabled?: boolean;
    className?: string;
}

export function AdminLocaleSelector({
    activeLocale,
    completion,
    onChange,
    disabled = false,
    className,
}: AdminLocaleSelectorProps) {
    const { locales } = usePage().props;

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex flex-wrap items-center gap-2">
                <label
                    htmlFor="admin-content-locale"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                    Content language
                </label>
                <select
                    id="admin-content-locale"
                    value={activeLocale}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value as LocaleCode)}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {Object.entries(locales).map(([code, meta]) => (
                        <option key={code} value={code}>
                            {meta.native} ({meta.label})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {Object.entries(locales).map(([code]) => {
                    const locale = code as LocaleCode;
                    const complete = completion[locale];

                    return (
                        <span
                            key={code}
                            className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]',
                                complete
                                    ? 'bg-secondary/10 text-secondary'
                                    : 'bg-surface-muted text-muted-foreground',
                            )}
                        >
                            {code}
                            {complete ? ' ✓' : ' —'}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
