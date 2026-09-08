import { Link, router } from '@inertiajs/react';
import { ChevronRight, Compass, MapPinned, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

import { customBookingHref, tourPackagesHref } from '@/components/public/navigation';
import { useTranslations } from '@/hooks/use-translations';

interface BookNowChoiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const choiceClassName =
    'group flex w-full items-center gap-4 rounded-2xl border border-border bg-background px-4 py-4 text-start transition-[border-color,background-color] duration-200 hover:border-secondary/50 hover:bg-surface-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none';

export function BookNowChoiceDialog({ isOpen, onClose }: BookNowChoiceDialogProps) {
    const titleId = useId();
    const firstChoiceRef = useRef<HTMLAnchorElement>(null);
    const { t } = useTranslations();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        window.setTimeout(() => firstChoiceRef.current?.focus(), 0);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-7">
                    <h2 id={titleId} className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        {t('bookNowDialog.title')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        aria-label={t('buttons.close')}
                    >
                        <X className="size-5" aria-hidden />
                    </button>
                </div>

                <div className="grid gap-3 p-6 sm:p-7">
                    <Link
                        ref={firstChoiceRef}
                        href={customBookingHref}
                        onClick={onClose}
                        className={choiceClassName}
                    >
                        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            <Compass className="size-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1 text-base font-semibold text-foreground">
                            {t('bookNowDialog.customTitle')}
                        </span>
                        <ChevronRight
                            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-secondary rtl:rotate-180"
                            aria-hidden
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            router.visit(tourPackagesHref);
                        }}
                        className={choiceClassName}
                    >
                        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            <MapPinned className="size-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1 text-base font-semibold text-foreground">
                            {t('bookNowDialog.fixedTitle')}
                        </span>
                        <ChevronRight
                            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-secondary rtl:rotate-180"
                            aria-hidden
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
