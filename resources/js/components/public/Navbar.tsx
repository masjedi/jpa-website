import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { BookNowChoiceDialog } from '@/components/public/BookNowChoiceDialog';
import { LanguageSwitcher } from '@/components/public/LanguageSwitcher';
import { isNavDropdown, type PrimaryNavItem, type PublicNavLink } from '@/components/public/navigation';
import { BrandLogo, brandLogoVariantForTheme } from '@/components/public/BrandLogo';
import { ThemeToggle } from '@/components/public/ThemeToggle';
import { useAppearance } from '@/hooks/use-appearance';
import { usePublicNavigation } from '@/hooks/use-public-navigation';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface NavbarProps {
    transparent?: boolean;
}

function NavLink({
    link,
    active,
    overlayHeader,
    block = false,
    onNavigate,
    nested = false,
}: {
    link: PublicNavLink;
    active: boolean;
    overlayHeader: boolean;
    block?: boolean;
    onNavigate?: () => void;
    nested?: boolean;
}) {
    const className = cn(
        'rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        nested ? 'block w-full px-4 py-2.5 text-start' : 'px-3.5 py-2 lg:px-4',
        block && !nested && 'block w-full',
        overlayHeader
            ? nested
                ? 'text-brand-on-surface/85 hover:bg-white/10 hover:text-brand-on-surface'
                : 'text-brand-on-surface/90 hover:text-brand-on-surface'
            : nested
              ? 'text-foreground/85 hover:bg-foreground/5 hover:text-foreground'
              : 'text-foreground/90 hover:text-foreground',
        active &&
            (overlayHeader
                ? nested
                    ? 'bg-white/10 text-brand-on-surface'
                    : 'text-brand-on-surface underline decoration-secondary decoration-2 underline-offset-4'
                : nested
                  ? 'bg-foreground/5 font-semibold text-primary dark:text-secondary'
                  : 'font-semibold text-primary dark:text-secondary'),
    );

    const isInternalPage = link.href.startsWith('/') && !link.href.includes('#');

    if (isInternalPage) {
        return (
            <Link
                href={link.href}
                className={className}
                onClick={onNavigate}
            >
                {link.label}
            </Link>
        );
    }

    return (
        <a href={link.href} className={className} onClick={onNavigate}>
            {link.label}
        </a>
    );
}

function NavDropdown({
    item,
    active,
    overlayHeader,
    isActive,
    onNavigate,
    mobile = false,
}: {
    item: Extract<PrimaryNavItem, { children: readonly PublicNavLink[] }>;
    active: boolean;
    overlayHeader: boolean;
    isActive: (href: string) => boolean;
    onNavigate?: () => void;
    mobile?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const dropdownId = useId();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open || mobile) {
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
    }, [open, mobile]);

    const closeAndNavigate = () => {
        setOpen(false);
        onNavigate?.();
    };

    const triggerClassName = cn(
        'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:px-4',
        mobile && 'w-full justify-between',
        overlayHeader
            ? 'text-brand-on-surface/90 hover:text-brand-on-surface'
            : 'text-foreground/90 hover:text-foreground',
        active &&
            (overlayHeader
                ? 'text-brand-on-surface underline decoration-secondary decoration-2 underline-offset-4'
                : 'font-semibold text-primary dark:text-secondary'),
    );

    const panelClassName = cn(
        mobile
            ? 'mt-1 space-y-1 ps-2'
            : 'absolute start-0 top-[calc(100%+0.35rem)] z-50 min-w-44 overflow-hidden rounded-2xl border py-1.5 shadow-xl backdrop-blur-xl',
        !mobile &&
            (overlayHeader
                ? 'border-white/10 bg-brand-deep/95'
                : 'border-border/70 bg-surface/95 dark:border-white/10'),
    );

    if (mobile) {
        return (
            <div>
                <button
                    type="button"
                    className={triggerClassName}
                    aria-expanded={open}
                    aria-controls={dropdownId}
                    onClick={() => setOpen((value) => !value)}
                >
                    <span>{item.label}</span>
                    <ChevronDown
                        className={cn('size-4 transition-transform', open && 'rotate-180')}
                        aria-hidden
                    />
                </button>
                {open ? (
                    <div id={dropdownId} className={panelClassName}>
                        {item.children.map((child) => (
                            <NavLink
                                key={child.href}
                                link={child}
                                active={isActive(child.href)}
                                overlayHeader={overlayHeader}
                                block
                                nested
                                onNavigate={closeAndNavigate}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                className={triggerClassName}
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls={dropdownId}
                onClick={() => setOpen((value) => !value)}
            >
                <span>{item.label}</span>
                <ChevronDown
                    className={cn('size-3.5 transition-transform', open && 'rotate-180')}
                    aria-hidden
                />
            </button>

            <div
                id={dropdownId}
                className={cn(
                    panelClassName,
                    'pointer-events-none invisible opacity-0 transition-[opacity,visibility] duration-150',
                    open && 'pointer-events-auto visible opacity-100',
                )}
            >
                {item.children.map((child) => (
                    <NavLink
                        key={child.href}
                        link={child}
                        active={isActive(child.href)}
                        overlayHeader={overlayHeader}
                        nested
                        onNavigate={closeAndNavigate}
                    />
                ))}
            </div>
        </div>
    );
}

function PrimaryNavItem({
    item,
    overlayHeader,
    isActive,
    onNavigate,
    mobile = false,
}: {
    item: PrimaryNavItem;
    overlayHeader: boolean;
    isActive: (href: string) => boolean;
    onNavigate?: () => void;
    mobile?: boolean;
}) {
    if (isNavDropdown(item)) {
        const dropdownActive = item.children.some((child) => isActive(child.href));

        return (
            <NavDropdown
                item={item}
                active={dropdownActive}
                overlayHeader={overlayHeader}
                isActive={isActive}
                onNavigate={onNavigate}
                mobile={mobile}
            />
        );
    }

    return (
        <NavLink
            link={item}
            active={isActive(item.href)}
            overlayHeader={overlayHeader}
            block={mobile}
            onNavigate={onNavigate}
        />
    );
}

export function Navbar({ transparent = false }: NavbarProps) {
    const menuId = useId();
    const { url } = usePage();
    const { resolved } = useAppearance();
    const { t } = useTranslations();
    const { primaryLinks } = usePublicNavigation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [bookNowOpen, setBookNowOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState(() =>
        typeof window === 'undefined' ? '' : window.location.hash,
    );
    const overlayHeader = transparent;
    const isDark = resolved === 'dark';

    useEffect(() => {
        const syncHash = () => {
            setCurrentHash(window.location.hash);
        };

        syncHash();
        window.addEventListener('hashchange', syncHash);

        return () => {
            window.removeEventListener('hashchange', syncHash);
        };
    }, []);

    useEffect(() => {
        if (!mobileOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [mobileOpen]);

    const isActive = (href: string) => {
        if (href === '/') {
            return (url === '/' || url === '') && currentHash === '';
        }

        if (href === '/tours') {
            const [pathOnly = '', query = ''] = url.split('?');
            const params = new URLSearchParams(query);
            const discoveryView = params.get('view');

            if (pathOnly.startsWith('/tours/')) {
                return true;
            }

            return pathOnly === '/tours' && discoveryView !== 'packages' && discoveryView !== 'destinations';
        }

        if (href === '/tours?view=packages') {
            const [pathOnly = ''] = url.split('?');

            return (
                pathOnly.startsWith('/packages/') ||
                url === '/tours?view=packages' ||
                url.startsWith('/tours?view=packages&')
            );
        }

        if (href === '/tours?view=destinations') {
            const [pathOnly = ''] = url.split('?');

            return (
                pathOnly === '/destinations' ||
                pathOnly.startsWith('/destinations/') ||
                url === '/tours?view=destinations' ||
                url.startsWith('/tours?view=destinations&')
            );
        }

        if (href === '/services') {
            return url === '/services' || url.startsWith('/services/');
        }

        if (href === '/articles') {
            return url === '/articles' || url.startsWith('/articles/');
        }

        if (href === '/about') {
            return url === '/about';
        }

        if (href === '/about/team') {
            return url === '/about/team';
        }

        if (href === '/contact') {
            return url === '/contact' || url.startsWith('/contact/');
        }

        if (href.startsWith('/#')) {
            return (url === '/' || url === '') && currentHash === href.slice(1);
        }

        if (href.startsWith('#')) {
            return currentHash === href;
        }

        return url.startsWith(href);
    };

    const usesDarkLogoSurface = isDark || overlayHeader;

    const shellClassName = overlayHeader
        ? isDark
            ? 'border-white/10 bg-brand-deep/92 text-brand-on-surface shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
            : 'border-white/15 bg-brand-surface/92 text-brand-on-surface shadow-[0_12px_40px_rgba(7,23,34,0.28)]'
        : isDark
          ? 'border-white/10 bg-surface/95 text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
          : 'border-border/70 bg-surface/95 text-foreground shadow-[0_12px_40px_rgba(22,59,92,0.08)]';

    return (
        <>
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto mx-auto max-w-7xl">
                <div
                    className={cn(
                        'flex items-center justify-between gap-3 rounded-full border px-3 py-2 shadow-xl backdrop-blur-xl sm:px-4 sm:py-2.5 lg:px-5',
                        shellClassName,
                    )}
                >
                    <BrandLogo
                        variant={brandLogoVariantForTheme(usesDarkLogoSurface)}
                        className="min-w-0"
                        imageClassName="max-w-[10.5rem] sm:max-w-[12.5rem] lg:max-w-[14rem]"
                    />

                    <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex" aria-label={t('nav.primary')}>
                        {primaryLinks.map((item) => (
                            <PrimaryNavItem
                                key={isNavDropdown(item) ? item.label : item.href}
                                item={item}
                                overlayHeader={overlayHeader}
                                isActive={isActive}
                            />
                        ))}
                    </nav>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <LanguageSwitcher glass={overlayHeader} />

                        <div
                            className={cn(
                                'hidden h-6 w-px lg:block',
                                overlayHeader ? 'bg-white/20' : 'bg-border dark:bg-white/15',
                            )}
                            aria-hidden
                        />

                        <ThemeToggle glass={overlayHeader} />

                        <button
                            type="button"
                            onClick={() => setBookNowOpen(true)}
                            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:inline-flex"
                        >
                            {t('buttons.bookNow')}
                        </button>

                        <button
                            type="button"
                            className={cn(
                                'inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus xl:hidden',
                                overlayHeader
                                    ? 'text-brand-on-surface hover:bg-white/10'
                                    : 'text-foreground hover:bg-foreground/5',
                            )}
                            aria-label={mobileOpen ? t('common.closeMenu') : t('common.openMenu')}
                            aria-expanded={mobileOpen}
                            aria-controls={menuId}
                            onClick={() => setMobileOpen((open) => !open)}
                        >
                            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
                        </button>
                    </div>
                </div>

                {mobileOpen ? (
                    <nav
                        id={menuId}
                        className={cn(
                            'mt-3 rounded-3xl border p-3 shadow-xl backdrop-blur-xl xl:hidden',
                            overlayHeader
                                ? isDark
                                    ? 'border-white/10 bg-brand-deep/95'
                                    : 'border-white/15 bg-brand-surface/95'
                                : isDark
                                  ? 'border-white/10 bg-surface/95'
                                  : 'border-border/70 bg-surface/95',
                        )}
                        aria-label={t('nav.mobilePrimary')}
                    >
                        <div className="mb-3 flex justify-center border-b border-border/60 pb-4 dark:border-white/10">
                            <BrandLogo
                                variant="horizontal-white"
                                href="/"
                                imageClassName="h-12 w-auto max-w-[16rem]"
                                onClick={() => setMobileOpen(false)}
                            />
                        </div>
                        <ul className="space-y-1">
                            {primaryLinks.map((item) => (
                                <li key={isNavDropdown(item) ? item.label : item.href}>
                                    <PrimaryNavItem
                                        item={item}
                                        overlayHeader={overlayHeader}
                                        isActive={isActive}
                                        onNavigate={() => setMobileOpen(false)}
                                        mobile
                                    />
                                </li>
                            ))}
                            <li
                                className={cn(
                                    'flex items-center justify-between rounded-full px-3.5 py-2',
                                    overlayHeader ? 'text-brand-on-surface' : 'text-foreground',
                                )}
                            >
                                <span className="text-sm font-medium">{t('common.theme')}</span>
                                <ThemeToggle glass={overlayHeader} />
                            </li>
                            <li
                                className={cn(
                                    'flex items-center justify-between rounded-full px-3.5 py-2',
                                    overlayHeader ? 'text-brand-on-surface' : 'text-foreground',
                                )}
                            >
                                <span className="text-sm font-medium">{t('language.label')}</span>
                                <LanguageSwitcher glass={overlayHeader} />
                            </li>
                            <li className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileOpen(false);
                                        setBookNowOpen(true);
                                    }}
                                    className="inline-flex w-full justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    {t('buttons.bookNow')}
                                </button>
                            </li>
                        </ul>
                    </nav>
                ) : null}
            </div>
        </header>
            <BookNowChoiceDialog isOpen={bookNowOpen} onClose={() => setBookNowOpen(false)} />
        </>
    );
}
