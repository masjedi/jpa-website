import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AdminSectionHeaderProps {
    eyebrow: string;
    title: string;
    description: string;
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
                'overflow-hidden rounded-2xl border border-border bg-surface shadow-sm',
                className,
            )}
        >
            <div className="border-b border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_10%,transparent),color-mix(in_srgb,var(--secondary)_8%,transparent))] px-6 py-6 sm:px-8 sm:py-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="size-5" aria-hidden />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-secondary">
                                {eyebrow}
                            </p>
                            <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                                {title}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {description}
                            </p>
                        </div>
                    </div>

                    {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
                </div>
            </div>
        </header>
    );
}
