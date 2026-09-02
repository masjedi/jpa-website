import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { useAppearance } from '@/hooks/use-appearance';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    glass?: boolean;
}

export function ThemeToggle({ glass = false }: ThemeToggleProps) {
    const { resolved, toggleAppearance } = useAppearance();
    const { t } = useTranslations();
    const prefersReducedMotion = useReducedMotion();
    const isDark = resolved === 'dark';

    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
                toggleAppearance();
            }}
            className={cn(
                'relative isolate inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                glass
                    ? 'text-brand-on-surface hover:bg-white/10'
                    : 'text-foreground hover:bg-foreground/5',
            )}
            aria-label={isDark ? t('common.switchToLightTheme') : t('common.switchToDarkTheme')}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? 'moon' : 'sun'}
                    initial={prefersReducedMotion ? false : { opacity: 0, rotate: -20, scale: 0.85 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, rotate: 20, scale: 0.85 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {isDark ? <Moon className="size-5" aria-hidden /> : <Sun className="size-5" aria-hidden />}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
