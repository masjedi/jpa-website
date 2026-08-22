import type { ReactNode } from 'react';

interface AdminSectionPanelProps {
    title: string;
    description?: string;
    children?: ReactNode;
}

export function AdminSectionPanel({ title, description, children }: AdminSectionPanelProps) {
    return (
        <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-4 py-3 sm:px-5">
                <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">{title}</h3>
                {description ? (
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>
                ) : null}
            </div>
            <div className="px-4 py-5 sm:px-5 sm:py-6">{children}</div>
        </section>
    );
}
