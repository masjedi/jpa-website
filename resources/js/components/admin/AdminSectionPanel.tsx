import type { ReactNode } from 'react';

interface AdminSectionPanelProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
}

export function AdminSectionPanel({
    title,
    description,
    actions,
    children,
}: AdminSectionPanelProps) {
    return (
        <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                <div className="min-w-0">
                    <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">{title}</h3>
                    {description ? (
                        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>
                    ) : null}
                </div>
                {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
            </div>
            <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
        </section>
    );
}
