import type { ReactNode } from 'react';

interface AdminSectionPanelProps {
    title: string;
    description?: string;
    children?: ReactNode;
}

export function AdminSectionPanel({ title, description, children }: AdminSectionPanelProps) {
    return (
        <section className="rounded-2xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4 sm:px-8">
                <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            <div className="px-6 py-8 sm:px-8">{children}</div>
        </section>
    );
}
