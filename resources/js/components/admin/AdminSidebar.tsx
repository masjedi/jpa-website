import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';

import { adminNavItems, isAdminNavActive } from '@/components/admin/adminNav';
import { BrandLogo } from '@/components/public/BrandLogo';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
    currentPath: string;
    mobileOpen: boolean;
    onMobileClose: () => void;
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
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isAdminNavActive(currentPath, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onMobileClose}
                                className={cn(
                                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                    isActive
                                        ? 'bg-white/14 text-white shadow-[inset_3px_0_0_0_var(--accent)]'
                                        : 'text-white/72 hover:bg-white/8 hover:text-white',
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-secondary/25 text-secondary'
                                            : 'bg-white/6 text-white/70 group-hover:bg-white/10 group-hover:text-white',
                                    )}
                                >
                                    <Icon className="size-4" aria-hidden />
                                </span>
                                <span className="flex-1 truncate">{item.label}</span>
                                {item.badge ? (
                                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </Link>
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
