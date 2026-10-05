import { Link } from '@inertiajs/react';

import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';

export type BrandLogoVariant = 'horizontal-white' | 'horizontal-color';

interface BrandLogoProps {
    variant?: BrandLogoVariant;
    className?: string;
    imageClassName?: string;
    href?: string;
    onClick?: () => void;
}

export function BrandLogo({
    variant = 'horizontal-white',
    className,
    imageClassName,
    href = '/',
    onClick,
}: BrandLogoProps) {
    const settings = useSiteSettings();
    const isWhite = variant === 'horizontal-white';
    const src = isWhite ? settings.logoWhite : settings.logoColor;

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
                src={src}
                alt={settings.brandName}
                width={300}
                height={70}
                className={cn(
                    'h-8 w-auto object-contain object-left sm:h-9',
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
