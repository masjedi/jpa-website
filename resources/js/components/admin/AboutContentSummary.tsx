import { Pencil } from 'lucide-react';

import type { AboutPageContent } from '@/types/aboutPage';

interface AboutContentSummaryProps {
    content: AboutPageContent;
    onEdit: () => void;
}

function SummaryBlock({
    label,
    title,
    preview,
}: {
    label: string;
    title: string;
    preview: string;
}) {
    return (
        <div className="rounded-lg border border-border/80 bg-background/60 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">{title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {preview}
            </p>
        </div>
    );
}

export function AboutContentSummary({ content, onEdit }: AboutContentSummaryProps) {
    return (
        <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
                <SummaryBlock
                    label="Journey intro"
                    title={content.intro.title}
                    preview={content.intro.description}
                />
                <SummaryBlock
                    label="Mission & vision"
                    title={content.missionSection.title}
                    preview={`${content.missionVision.mission.title} · ${content.missionVision.vision.title}`}
                />
                <SummaryBlock
                    label="Call to action"
                    title={content.cta.title}
                    preview={`${content.cta.primaryLabel} → ${content.cta.primaryHref}`}
                />
            </div>

            <div className="flex justify-end border-t border-border pt-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted sm:text-sm"
                >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit page content
                </button>
            </div>
        </div>
    );
}
