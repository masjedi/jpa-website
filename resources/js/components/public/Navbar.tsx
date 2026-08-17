import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import { planTripHref, primaryLinks } from '@/components/public/navigation';
import { ThemeToggle } from '@/components/public/ThemeToggle';
import { useAppearance } from '@/hooks/use-appearance';
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
}: {
    link: (typeof primaryLinks)[number];
    active: boolean;
    overlayHeader: boolean;
    block?: boolean;
    onNavigate?: () => void;
}) {
    const className = cn(
        'rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:px-4',
        block && 'block w-full',
        overlayHeader
            ? 'text-brand-on-surface/90 hover:text-brand-on-surface'
            : 'text-foreground/90 hover:text-foreground',
        active &&
            (overlayHeader
                ? 'text-brand-on-surface underline decoration-secondary decoration-2 underline-offset-4'
                : 'font-semibold text-primary dark:text-secondary'),
    );

    const isInternalPage = link.href.startsWith('/') && !link.href.includes('#');

    if (isInternalPage) {
        return (
            <Link href={link.href} className={className} onClick={onNavigate}>
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

export function Navbar({ transparent = false }: NavbarProps) {
    const menuId = useId();
    const { url } = usePage();
    const { resolved } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);
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
            return url === '/tours' || url.startsWith('/tours?');
        }

        if (href.startsWith('/#')) {
            return (url === '/' || url === '') && currentHash === href.slice(1);
        }

        if (href.startsWith('#')) {
            return currentHash === href;
        }

        return url.startsWith(href);
    };

    const shellClassName = overlayHeader
        ? isDark
            ? 'border-white/10 bg-[#071722]/92 text-brand-on-surface shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
            : 'border-white/15 bg-[#163B5C]/92 text-brand-on-surface shadow-[0_12px_40px_rgba(7,23,34,0.28)]'
        : isDark
          ? 'border-white/10 bg-surface/95 text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
          : 'border-border/70 bg-surface/95 text-foreground shadow-[0_12px_40px_rgba(22,59,92,0.08)]';

    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto mx-auto max-w-7xl">
                <div
                    className={cn(
                        'flex items-center justify-between gap-3 rounded-full border px-3 py-2 shadow-xl backdrop-blur-xl sm:px-4 sm:py-2.5 lg:px-5',
                        shellClassName,
                    )}
                >
                    <Link
                        href="/"
                        className={cn(
                            'flex min-w-0 shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                            overlayHeader ? 'text-brand-on-surface' : 'text-foreground',
                        )}
                    >
                        <span
                            aria-hidden
                            className={cn(
                                'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                                overlayHeader
                                    ? 'bg-white/15 text-brand-on-surface'
                                    : 'bg-primary text-primary-foreground',
                            )}
                        >
                            AT
                        </span>
                        <span className="font-heading truncate text-sm font-semibold sm:text-base lg:text-lg">
                            Journey To Peach Afghanistan
                        </span>
                    </Link>

                    <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex" aria-label="Primary">
                        {primaryLinks.map((link) => (
                            <NavLink
                                key={link.label}
                                link={link}
                                active={isActive(link.href)}
                                overlayHeader={overlayHeader}
                            />
                        ))}
                    </nav>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            className={cn(
                                'hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:inline-flex',
                                overlayHeader
                                    ? 'text-brand-on-surface/90 hover:text-brand-on-surface'
                                    : 'text-foreground/90 hover:text-foreground',
                            )}
                            aria-label="Language: English"
                        >
                            <Globe className="size-4" aria-hidden />
                            <span>English</span>
                            <ChevronDown className="size-4 opacity-70" aria-hidden />
                        </button>

                        <div
                            className={cn(
                                'hidden h-6 w-px lg:block',
                                overlayHeader ? 'bg-white/20' : 'bg-border dark:bg-white/15',
                            )}
                            aria-hidden
                        />

                        <ThemeToggle glass={overlayHeader} />

                        <a
                            href={planTripHref}
                            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:inline-flex"
                        >
                            Plan My Trip
                        </a>

                        <button
                            type="button"
                            className={cn(
                                'inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus xl:hidden',
                                overlayHeader
                                    ? 'text-brand-on-surface hover:bg-white/10'
                                    : 'text-foreground hover:bg-foreground/5',
                            )}
                            aria-expanded={mobileOpen}
                            aria-controls={menuId}
                            onClick={() => setMobileOpen((open) => !open)}
                        >
                            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
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
                                    ? 'border-white/10 bg-[#071722]/95'
                                    : 'border-white/15 bg-[#163B5C]/95'
                                : isDark
                                  ? 'border-white/10 bg-surface/95'
                                  : 'border-border/70 bg-surface/95',
                        )}
                        aria-label="Mobile primary"
                    >
                        <ul className="space-y-1">
                            {primaryLinks.map((link) => (
                                <li key={link.label}>
                                    <NavLink
                                        link={link}
                                        active={isActive(link.href)}
                                        overlayHeader={overlayHeader}
                                        block
                                        onNavigate={() => setMobileOpen(false)}
                                    />
                                </li>
                            ))}
                            <li
                                className={cn(
                                    'flex items-center justify-between rounded-full px-3.5 py-2',
                                    overlayHeader ? 'text-brand-on-surface' : 'text-foreground',
                                )}
                            >
                                <span className="text-sm font-medium">Theme</span>
                                <ThemeToggle glass={overlayHeader} />
                            </li>
                            <li className="pt-1">
                                <a
                                    href={planTripHref}
                                    className="inline-flex w-full justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Plan My Trip
                                </a>
                            </li>
                        </ul>
                    </nav>
                ) : null}
            </div>
        </header>
    );
}
