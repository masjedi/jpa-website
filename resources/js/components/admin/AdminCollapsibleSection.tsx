import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AdminCollapsibleSectionProps {
    title: string;
    description?: string;
    defaultOpen?: boolean;
    children: ReactNode;
}

export function AdminCollapsibleSection({
    title,
    description,
    defaultOpen = false,
    children,
}: AdminCollapsibleSectionProps) {
    const panelId = useId();
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-surface-muted/20">
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
