import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const defaultViewport = {
    once: true,
    amount: 0.18,
} as const;

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    duration?: number;
}

export function FadeIn({
    children,
    className,
    delay = 0,
    y = 28,
    duration = 0.65,
}: FadeInProps) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{
                duration,
                delay,
                ease: REVEAL_EASE,
            }}
        >
            {children}
        </motion.div>
    );
}

interface FadeInOnMountProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    duration?: number;
}

export function FadeInOnMount({
    children,
    className,
    delay = 0,
    y = 20,
    duration = 0.7,
}: FadeInOnMountProps) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration,
                delay,
                ease: REVEAL_EASE,
            }}
        >
            {children}
        </motion.div>
    );
}

interface RevealStaggerProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
    delayChildren?: number;
}

export function RevealStagger({
    children,
    className,
    stagger = 0.08,
    delayChildren = 0,
}: RevealStaggerProps) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: stagger,
                        delayChildren,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

interface RevealItemProps {
    children: ReactNode;
    className?: string;
    y?: number;
    duration?: number;
}

export function RevealItem({
    children,
    className,
    y = 28,
    duration = 0.65,
}: RevealItemProps) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration, ease: REVEAL_EASE },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

/** @alias FadeIn */
export const Reveal = FadeIn;
