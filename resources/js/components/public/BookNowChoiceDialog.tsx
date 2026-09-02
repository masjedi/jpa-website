import { Link, router } from '@inertiajs/react';
import { Compass, MapPinned, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef } from 'react';

import { customBookingHref, tourPackagesHref } from '@/components/public/navigation';
import { useTranslations } from '@/hooks/use-translations';

interface BookNowChoiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

function goToTourPackages(smooth: boolean): void {
    const onToursPage = window.location.pathname.replace(/\/$/, '') === '/tours';

    if (onToursPage) {
        window.history.pushState(null, '', tourPackagesHref);
        document.getElementById('packages')?.scrollIntoView({
            block: 'start',
            behavior: smooth ? 'smooth' : 'auto',
        });
        window.dispatchEvent(new Event('hashchange'));
        return;
    }

    router.visit('/tours', {
        onSuccess: () => {
            window.history.replaceState(null, '', tourPackagesHref);
            window.requestAnimationFrame(() => {
                document.getElementById('packages')?.scrollIntoView({
                    block: 'start',
                    behavior: smooth ? 'smooth' : 'auto',
                });
            });
        },
    });
}

export function BookNowChoiceDialog({ isOpen, onClose }: BookNowChoiceDialogProps) {
    const titleId = useId();
    const descriptionId = useId();
    const firstChoiceRef = useRef<HTMLAnchorElement>(null);
    const reducedMotion = useReducedMotion();
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
            aria-describedby={descriptionId}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4 sm:px-7">
                    <div>
                        <h2
                            id={titleId}
                            className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
                        >
                            {t('bookNowDialog.title')}
                        </h2>
                        <p
                            id={descriptionId}
                            className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
                        >
                            {t('bookNowDialog.description')}
                        </p>
                    </div>
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
                        className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-4 text-start transition-colors hover:border-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            <Compass className="size-5" aria-hidden />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold text-foreground">
                                {t('bookNowDialog.customTitle')}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                                {t('bookNowDialog.customDescription')}
                            </span>
                        </span>
                    </Link>

                    <a
                        href={tourPackagesHref}
                        onClick={(event) => {
                            event.preventDefault();
                            onClose();
                            goToTourPackages(!reducedMotion);
                        }}
                        className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-4 text-start transition-colors hover:border-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            <MapPinned className="size-5" aria-hidden />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold text-foreground">
                                {t('bookNowDialog.fixedTitle')}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                                {t('bookNowDialog.fixedDescription')}
                            </span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
