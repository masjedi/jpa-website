import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { ContentRecordView } from '@/components/admin/ContentRecordView';
import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';

interface ContentRecordViewDialogProps {
    open: boolean;
    title: string;
    description?: string;
    model: ContentRecordViewModel | null;
    onClose: () => void;
    onEdit?: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ContentRecordViewDialog({
    open,
    title,
    description,
    model,
    onClose,
    onEdit,
    size = 'xl',
}: ContentRecordViewDialogProps) {
    const isCompact = model?.layout === 'compact';

    return (
        <DataTableDialog
            open={open}
            title={title}
            description={description}
            onClose={onClose}
            size={size}
        >
            {open && model ? (
                <ContentRecordView
                    model={model}
                    className={isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}
                />
            ) : null}

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    Close
                </button>
                {onEdit ? (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Edit record
                    </button>
                ) : null}
            </footer>
        </DataTableDialog>
    );
}
