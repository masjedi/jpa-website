import { Link } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import {
    adminNavEntries,
    isAdminNavActive,
    isAdminNavGroupActive,
    type AdminNavGroup,
    type AdminNavItem,
} from '@/components/admin/adminNav';
import { BrandLogo } from '@/components/public/BrandLogo';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
    currentPath: string;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

function AdminNavLink({
    item,
    currentPath,
    onNavigate,
    nested = false,
}: {
    item: AdminNavItem;
    currentPath: string;
    onNavigate: () => void;
    nested?: boolean;
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
                    ? 'bg-white/14 text-white shadow-[inset_3px_0_0_0_var(--accent)]'
                    : 'text-white/72 hover:bg-white/8 hover:text-white',
            )}
        >
            <span
                className={cn(
                    'inline-flex shrink-0 items-center justify-center rounded-lg transition-colors',
                    nested ? 'size-7' : 'size-8',
                    isActive
                        ? 'bg-secondary/25 text-secondary'
                        : 'bg-white/6 text-white/70 group-hover:bg-white/10 group-hover:text-white',
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
}: {
    group: AdminNavGroup;
    currentPath: string;
    onNavigate: () => void;
}) {
    const panelId = useId();
    const hasActiveChild = isAdminNavGroupActive(currentPath, group.items);
    const [open, setOpen] = useState(hasActiveChild);
    const Icon = group.icon;

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
                        ? 'bg-white/10 text-white'
                        : 'text-white/72 hover:bg-white/8 hover:text-white',
                )}
            >
                <span
                    className={cn(
                        'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                        hasActiveChild
                            ? 'bg-secondary/25 text-secondary'
                            : 'bg-white/6 text-white/70 group-hover:bg-white/10 group-hover:text-white',
                    )}
                >
                    <Icon className="size-4" aria-hidden />
                </span>
                <span className="flex-1 truncate text-start">{group.label}</span>
                <ChevronDown
                    className={cn(
                        'size-4 shrink-0 text-white/55 transition-transform duration-200 motion-reduce:transition-none',
                        open && 'rotate-180',
                    )}
                    aria-hidden
                />
            </button>

            {open ? (
                <div id={panelId} className="space-y-1 border-s border-white/10 ps-3 ms-5">
                    {group.items.map((item) => (
                        <AdminNavLink
                            key={item.href}
                            item={item}
                            currentPath={currentPath}
                            onNavigate={onNavigate}
                            nested
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function AdminSidebar({ currentPath, mobileOpen, onMobileClose }: AdminSidebarProps) {
    return (
        <>
            <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onMobileClose}
                className={cn(
                    'fixed inset-0 z-40 bg-brand-deep/70 backdrop-blur-[2px] transition-opacity lg:hidden',
                    mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-white/10 bg-brand-deep text-brand-on-surface shadow-xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                )}
                aria-label="Admin sidebar"
            >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
                    <div className="min-w-0">
                        <BrandLogo variant="horizontal-white" href="/admin/dashboard" />
                        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                            Content management
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/10 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
                    {adminNavEntries.map((entry) => {
                        if (entry.type === 'group') {
                            return (
                                <AdminNavGroupSection
                                    key={entry.label}
                                    group={entry}
                                    currentPath={currentPath}
                                    onNavigate={onMobileClose}
                                />
                            );
                        }

                        return (
                            <AdminNavLink
                                key={entry.href}
                                item={entry}
                                currentPath={currentPath}
                                onNavigate={onMobileClose}
                            />
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-xs text-white/55">Journey to Peace CMS</p>
                    <p className="mt-1 text-sm text-white/80">Afghanistan tours workspace</p>
                </div>
            </aside>
        </>
    );
}
