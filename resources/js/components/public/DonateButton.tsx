import { Link } from '@inertiajs/react';
import { HandHeart } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { donateHref } from '@/components/public/navigation';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface DonateButtonProps {
    variant?: 'hero' | 'default';
    className?: string;
}

export function DonateButton({
    variant = 'default',
    className,
}: DonateButtonProps) {
    const reducedMotion = useReducedMotion();
    const { t } = useTranslations();

    return (
        <Link
            href={donateHref}
            className={cn(
                'group inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                variant === 'hero'
                    ? 'bg-primary px-5 py-2.5 text-primary-foreground shadow-[0_8px_24px_rgba(22,59,92,0.35)] hover:opacity-95'
                    : 'border border-border bg-surface px-4 py-2 text-foreground shadow-sm hover:border-secondary/40 hover:bg-surface-muted',
                className,
            )}
        >
            <motion.span
                className="inline-flex text-accent"
                animate={
                    reducedMotion
                        ? undefined
                        : { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }
                }
                transition={
                    reducedMotion
                        ? undefined
                        : {
                              duration: 2.8,
                              repeat: Infinity,
                              ease: 'easeInOut',
                          }
                }
                aria-hidden
            >
                <HandHeart className="size-4" />
            </motion.span>
            <span>{t('buttons.donate')}</span>
            <motion.span
                aria-hidden
                className={cn(
                    'size-1.5 rounded-full bg-accent',
                    variant === 'hero' ? 'opacity-90' : 'opacity-100',
                )}
                animate={
                    reducedMotion
                        ? undefined
                        : { opacity: [0.4, 1, 0.4], scale: [0.85, 1.15, 0.85] }
                }
                transition={
                    reducedMotion
                        ? undefined
                        : {
                              duration: 2.8,
                              repeat: Infinity,
                              ease: 'easeInOut',
                          }
                }
            />
        </Link>
    );
}
