import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AdminSectionHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    icon: LucideIcon;
    actions?: ReactNode;
    className?: string;
}

export function AdminSectionHeader({
    eyebrow,
    title,
    description,
    icon: Icon,
    actions,
    className,
}: AdminSectionHeaderProps) {
    return (
        <header
            className={cn(
                'rounded-xl border border-border/80 bg-surface/90 px-4 py-3 shadow-sm sm:px-5',
                className,
            )}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary ring-1 ring-primary/10">
                        <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                                {eyebrow}
                            </span>
                            <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                                {title}
                            </h2>
                        </div>
                        {description ? (
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-1 sm:text-sm">
                                {description}
                            </p>
                        ) : null}
                    </div>
                </div>

                {actions ? (
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end [&_button]:rounded-lg [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-xs [&_button]:font-semibold sm:[&_button]:px-3.5 sm:[&_button]:py-2 sm:[&_button]:text-sm">
                        {actions}
                    </div>
                ) : null}
            </div>
        </header>
    );
}
