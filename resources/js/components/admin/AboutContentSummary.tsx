import { Pencil } from 'lucide-react';

import { primaryTranslation } from '@/lib/translations';
import type { AdminAboutPageContent } from '@/types/aboutPage';

interface AboutContentSummaryProps {
    content: AdminAboutPageContent;
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
                    title={primaryTranslation(content.intro.title)}
                    preview={primaryTranslation(content.intro.description)}
                />
                <SummaryBlock
                    label="Mission & vision"
                    title={primaryTranslation(content.missionSection.title)}
                    preview={`${primaryTranslation(content.missionVision.mission.title)} · ${primaryTranslation(content.missionVision.vision.title)}`}
                />
                <SummaryBlock
                    label="Call to action"
                    title={primaryTranslation(content.cta.title)}
                    preview={`${primaryTranslation(content.cta.primaryLabel)} → ${content.cta.primaryHref}`}
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
