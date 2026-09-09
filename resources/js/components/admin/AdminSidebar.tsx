import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import {
    adminNavBadgeForHref,
    adminNavEntries,
    isAdminNavActive,
    isAdminNavGroupActive,
    type AdminNavGroup,
    type AdminNavItem,
} from '@/components/admin/adminNav';
import { BrandLogo, brandLogoVariantForTheme } from '@/components/public/BrandLogo';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types/inertia';

interface AdminSidebarProps {
    currentPath: string;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

type BadgeCounts = {
    unreadMessages?: number;
};

function withDynamicBadge(item: AdminNavItem, counts: BadgeCounts): AdminNavItem {
    return {
        ...item,
        badge: adminNavBadgeForHref(item.href, counts) ?? item.badge,
    };
}

function AdminNavLink({
    item,
    currentPath,
    onNavigate,
    nested = false,
    isDark,
}: {
    item: AdminNavItem;
    currentPath: string;
    onNavigate: () => void;
    nested?: boolean;
    isDark: boolean;
}) {
    const Icon = item.icon;
    const isActive = isAdminNavActive(currentPath, item.href);

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                nested ? 'py-2 text-[13px]' : '',
                isActive
                    ? isDark
                        ? 'bg-white/14 text-white shadow-[inset_3px_0_0_0_var(--accent)]'
                        : 'bg-secondary/10 text-secondary shadow-[inset_3px_0_0_0_var(--accent)]'
                    : isDark
                      ? 'text-white/72 hover:bg-white/8 hover:text-white'
                      : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
            )}
        >
            <span
                className={cn(
                    'inline-flex shrink-0 items-center justify-center rounded-lg transition-colors',
                    nested ? 'size-7' : 'size-8',
                    isActive
                        ? 'bg-secondary/25 text-secondary'
                        : isDark
                          ? 'bg-white/6 text-white/70 group-hover:bg-white/10 group-hover:text-white'
                          : 'bg-surface-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary',
                )}
            >
                <Icon className={nested ? 'size-3.5' : 'size-4'} aria-hidden />
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    {item.badge}
                </span>
            ) : null}
        </Link>
    );
}

function AdminNavGroupSection({
    group,
    currentPath,
    onNavigate,
    isDark,
    badgeCounts,
}: {
    group: AdminNavGroup;
    currentPath: string;
    onNavigate: () => void;
    isDark: boolean;
    badgeCounts: BadgeCounts;
}) {
    const panelId = useId();
    const hasActiveChild = isAdminNavGroupActive(currentPath, group.items);
    const [open, setOpen] = useState(hasActiveChild);
    const Icon = group.icon;
    const items = group.items.map((item) => withDynamicBadge(item, badgeCounts));

    useEffect(() => {
        if (hasActiveChild) {
            setOpen(true);
        }
    }, [hasActiveChild]);

    return (
        <div className="space-y-1">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls={panelId}
                className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    hasActiveChild
                        ? isDark
                            ? 'bg-white/10 text-white'
                            : 'bg-surface-muted text-foreground'
                        : isDark
                          ? 'text-white/72 hover:bg-white/8 hover:text-white'
                          : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                )}
            >
                <span
                    className={cn(
                        'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                        hasActiveChild
                            ? 'bg-secondary/25 text-secondary'
                            : isDark
                              ? 'bg-white/6 text-white/70 group-hover:bg-white/10 group-hover:text-white'
                              : 'bg-surface-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary',
                    )}
                >
                    <Icon className="size-4" aria-hidden />
                </span>
                <span className="flex-1 truncate text-start">{group.label}</span>
                <ChevronDown
                    className={cn(
                        'size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none',
                        isDark ? 'text-white/55' : 'text-muted-foreground',
                        open && 'rotate-180',
                    )}
                    aria-hidden
                />
            </button>

            {open ? (
                <div
                    id={panelId}
                    className={cn(
                        'ms-5 space-y-1 border-s ps-3',
                        isDark ? 'border-white/10' : 'border-border',
                    )}
                >
                    {items.map((item) => (
                        <AdminNavLink
                            key={item.href}
                            item={item}
                            currentPath={currentPath}
                            onNavigate={onNavigate}
                            nested
                            isDark={isDark}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function AdminSidebar({ currentPath, mobileOpen, onMobileClose }: AdminSidebarProps) {
    const { resolved } = useAppearance();
    const isDark = resolved === 'dark';
    const { adminFeed } = usePage<SharedPageProps>().props;
    const badgeCounts: BadgeCounts = {
        unreadMessages: adminFeed?.unreadMessages ?? 0,
    };

    return (
        <>
            <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onMobileClose}
                className={cn(
                    'fixed inset-0 z-40 backdrop-blur-[2px] transition-opacity lg:hidden',
                    isDark ? 'bg-brand-deep/70' : 'bg-foreground/25',
                    mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e transition-transform duration-300 ease-out motion-reduce:transition-none',
                    isDark
                        ? 'border-white/10 bg-brand-deep text-brand-on-surface shadow-xl'
                        : 'border-border bg-surface text-foreground shadow-sm',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                )}
                aria-label="Admin sidebar"
            >
                <div
                    className={cn(
                        'flex items-center justify-between gap-3 border-b px-5 py-5',
                        isDark ? 'border-white/10' : 'border-border',
                    )}
                >
                    <div className="min-w-0">
                        <BrandLogo
                            variant={brandLogoVariantForTheme(isDark)}
                            href="/admin/dashboard"
                        />
                        <p
                            className={cn(
                                'mt-2 text-[11px] font-medium uppercase tracking-[0.16em]',
                                isDark ? 'text-white/55' : 'text-muted-foreground',
                            )}
                        >
                            Content management
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onMobileClose}
                        className={cn(
                            'inline-flex size-9 items-center justify-center rounded-lg border transition-colors lg:hidden',
                            isDark
                                ? 'border-white/10 text-white/80 hover:bg-white/10'
                                : 'border-border text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                        )}
                        aria-label="Close sidebar"
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Admin navigation">
                    {adminNavEntries.map((entry) => {
                        if (entry.type === 'group') {
                            return (
                                <AdminNavGroupSection
                                    key={entry.label}
                                    group={entry}
                                    currentPath={currentPath}
                                    onNavigate={onMobileClose}
                                    isDark={isDark}
                                    badgeCounts={badgeCounts}
                                />
                            );
                        }

                        return (
                            <AdminNavLink
                                key={entry.href}
                                item={withDynamicBadge(entry, badgeCounts)}
                                currentPath={currentPath}
                                onNavigate={onMobileClose}
                                isDark={isDark}
                            />
                        );
                    })}
                </nav>

                <div
                    className={cn(
                        'border-t px-5 py-4',
                        isDark ? 'border-white/10' : 'border-border',
                    )}
                >
                    <p className={cn('text-xs', isDark ? 'text-white/55' : 'text-muted-foreground')}>
                        Journey to Peace CMS
                    </p>
                    <p className={cn('mt-1 text-sm', isDark ? 'text-white/80' : 'text-foreground')}>
                        Afghanistan tours workspace
                    </p>
                </div>
            </aside>
        </>
    );
}
