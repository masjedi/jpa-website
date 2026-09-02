import { router, usePage } from '@inertiajs/react';
import { ChevronDown, Globe } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    glass?: boolean;
}

export function LanguageSwitcher({ glass = false }: LanguageSwitcherProps) {
    const { locale, locales } = usePage().props;
    const { t } = useTranslations();
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const rootRef = useRef<HTMLDivElement>(null);

    const current = locales[locale] ?? { label: locale, native: locale };

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent | PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const switchLocale = (nextLocale: string) => {
        if (nextLocale === locale) {
            setOpen(false);
            return;
        }

        router.post(
            '/locale',
            { locale: nextLocale },
            {
                preserveScroll: true,
                onFinish: () => setOpen(false),
            },
        );
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    glass
                        ? 'text-brand-on-surface/90 hover:bg-white/10'
                        : 'text-foreground/90 hover:bg-foreground/5',
                )}
                aria-label={t('language.current', { language: current.native })}
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={menuId}
                onClick={() => setOpen((value) => !value)}
            >
                <Globe className="size-4" aria-hidden />
                <span className="hidden sm:inline">{current.native}</span>
                <ChevronDown
                    className={cn('size-3.5 transition-transform', open && 'rotate-180')}
                    aria-hidden
                />
            </button>

            <ul
                id={menuId}
                role="listbox"
                aria-label={t('language.choose')}
                className={cn(
                    'absolute end-0 top-[calc(100%+0.35rem)] z-50 min-w-40 overflow-hidden rounded-2xl border py-1.5 shadow-xl backdrop-blur-xl transition-[opacity,visibility] duration-150',
                    glass
                        ? 'border-white/10 bg-brand-deep/95'
                        : 'border-border/70 bg-surface/95 dark:border-white/10',
                    open
                        ? 'pointer-events-auto visible opacity-100'
                        : 'pointer-events-none invisible opacity-0',
                )}
            >
                {Object.entries(locales).map(([code, meta]) => {
                    const selected = code === locale;

                    return (
                        <li key={code} role="option" aria-selected={selected}>
                            <button
                                type="button"
                                className={cn(
                                    'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-sm transition-colors',
                                    selected
                                        ? 'bg-secondary/10 font-semibold text-secondary'
                                        : glass
                                          ? 'text-brand-on-surface/90 hover:bg-white/10'
                                          : 'text-foreground/90 hover:bg-foreground/5',
                                )}
                                onClick={() => switchLocale(code)}
                            >
                                <span>{meta.native}</span>
                                <span className="text-xs text-muted-foreground">{meta.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
