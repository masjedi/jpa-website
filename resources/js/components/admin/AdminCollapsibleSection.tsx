import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AdminCollapsibleSectionProps {
    title: string;
    description?: string;
    defaultOpen?: boolean;
    error?: boolean;
    children: ReactNode;
}

export function AdminCollapsibleSection({
    title,
    description,
    defaultOpen = false,
    error = false,
    children,
}: AdminCollapsibleSectionProps) {
    const panelId = useId();
    const [open, setOpen] = useState(defaultOpen || error);

    useEffect(() => {
        if (error) {
            setOpen(true);
        }
    }, [error]);

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border bg-surface-muted/20',
                error ? 'border-red-500/40' : 'border-border',
            )}
        >
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start transition-colors hover:bg-surface-muted/40"
            >
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    {description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                <ChevronDown
                    className={cn(
                        'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                        open && 'rotate-180',
                    )}
                    aria-hidden
                />
            </button>
            {open ? (
                <div id={panelId} className="border-t border-border px-3 py-3">
                    {children}
                </div>
            ) : null}
        </div>
    );
}
