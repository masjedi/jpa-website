import { motion, useReducedMotion } from 'motion/react';

interface AnimatedAxisDividerProps {
    axis?: 'x' | 'y';
    className?: string;
    /** When true, horizontal dividers stay visible on all breakpoints (not only mobile). */
    always?: boolean;
}

export function AnimatedAxisDivider({
    axis = 'y',
    className = '',
    always = false,
}: AnimatedAxisDividerProps) {
    const reducedMotion = useReducedMotion();
    const isVertical = axis === 'y';

    if (reducedMotion) {
        return (
            <div
                aria-hidden
                className={
                    isVertical
                        ? `hidden w-px self-stretch bg-border lg:block ${className}`
                        : `${always ? '' : 'lg:hidden '}h-px w-full bg-border ${className}`
                }
            />
        );
    }

    if (isVertical) {
        return (
            <div
                aria-hidden
                className={`relative hidden w-px self-stretch overflow-hidden bg-border/50 lg:block ${className}`}
            >
                <motion.div
                    className="absolute left-0 w-full bg-gradient-to-b from-transparent via-secondary to-accent"
                    style={{ height: '45%' }}
                    animate={{ top: ['-45%', '145%'] }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.4,
                    }}
                />
                <motion.div
                    className="absolute left-0 w-full opacity-60 bg-gradient-to-b from-transparent via-accent/80 to-transparent"
                    style={{ height: '25%' }}
                    animate={{ top: ['-25%', '125%'] }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2.2,
                        repeatDelay: 0.4,
                    }}
                />
            </div>
        );
    }

    return (
        <div
            aria-hidden
            className={`relative h-px w-full overflow-hidden bg-border/50 ${always ? '' : 'lg:hidden '}${className}`}
        >
            <motion.div
                className="absolute top-0 h-full bg-gradient-to-r from-transparent via-secondary to-accent"
                style={{ width: '45%' }}
                animate={{ left: ['-45%', '145%'] }}
                transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 0.4,
                }}
            />
        </div>
    );
}
