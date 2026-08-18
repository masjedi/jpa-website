import { Link } from '@inertiajs/react';

import { BRAND_LOGO, BRAND_NAME } from '@/components/public/brand';
import { cn } from '@/lib/utils';

export type BrandLogoVariant = 'horizontal-white' | 'horizontal-color' | 'stacked';

interface BrandLogoProps {
    variant?: BrandLogoVariant;
    className?: string;
    imageClassName?: string;
    href?: string;
    onClick?: () => void;
}

const variantConfig: Record<
    BrandLogoVariant,
    { src: string; alt: string; defaultImageClass: string }
> = {
    'horizontal-white': {
        src: BRAND_LOGO.white,
        alt: BRAND_NAME,
        defaultImageClass: 'h-8 w-auto sm:h-9',
    },
    'horizontal-color': {
        src: BRAND_LOGO.color,
        alt: BRAND_NAME,
        defaultImageClass: 'h-8 w-auto sm:h-9',
    },
    stacked: {
        src: BRAND_LOGO.main,
        alt: BRAND_NAME,
        defaultImageClass: 'h-16 w-auto sm:h-20',
    },
};

export function BrandLogo({
    variant = 'horizontal-white',
    className,
    imageClassName,
    href = '/',
    onClick,
}: BrandLogoProps) {
    const config = variantConfig[variant];

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                'inline-flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                className,
            )}
        >
            <img
                src={config.src}
                alt={config.alt}
                width={variant === 'stacked' ? 240 : 320}
                height={variant === 'stacked' ? 166 : 59}
                className={cn(
                    config.defaultImageClass,
                    'object-contain object-left',
                    imageClassName,
                )}
                decoding="async"
            />
        </Link>
    );
}

/** Pick horizontal logo for light vs dark surfaces. */
export function brandLogoVariantForTheme(isDark: boolean): BrandLogoVariant {
    return isDark ? 'horizontal-white' : 'horizontal-color';
}
