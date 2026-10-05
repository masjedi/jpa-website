import { Loader2, X } from 'lucide-react';
import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

interface DataTableDialogProps {
    open: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    onClose: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    preventDismiss?: boolean;
    loadingMessage?: string;
}

const dialogSizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-[min(96vw,90rem)]',
} as const;

export function DataTableDialog({
    open,
    title,
    description,
    children,
    onClose,
    size = 'md',
    preventDismiss = false,
    loadingMessage,
}: DataTableDialogProps) {
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !preventDismiss) {
                onClose();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose, open, preventDismiss]);

    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-brand-deep/65 backdrop-blur-[2px]"
                onClick={preventDismiss ? undefined : onClose}
                disabled={preventDismiss}
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className={cn(
                    'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl',
                    dialogSizes[size],
                )}
            >
                <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                    <div className="min-w-0">
                        <h2 id={titleId} className="font-heading text-base font-semibold text-foreground">
                            {title}
                        </h2>
                        {description ? (
                            <p
                                id={descriptionId}
                                className="mt-1 text-sm leading-relaxed text-muted-foreground"
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={preventDismiss}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </header>
                <div className="relative min-h-0 flex-1 overflow-y-auto">
                    {children}
                    {preventDismiss ? (
                        <div
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface/92 px-6 text-center backdrop-blur-[1px]"
                            role="status"
                            aria-live="polite"
                        >
                            <Loader2 className="size-8 animate-spin text-secondary" aria-hidden />
                            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                                {loadingMessage ??
                                    'Saving changes. Large hero images can take up to a minute on shared hosting.'}
                            </p>
                        </div>
                    ) : null}
                </div>
            </section>
        </div>,
        document.body,
    );
}
