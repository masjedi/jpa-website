import { Link, usePage } from '@inertiajs/react';
import { Bell, LogOut, Menu, MessageSquare, UserRound } from 'lucide-react';
import { useState } from 'react';

import { AdminNavbarDropdown } from '@/components/admin/AdminNavbarDropdown';
import { adminMessages, adminNotifications } from '@/data/adminNavbarFeed';
import { cn } from '@/lib/utils';
import '@/types/inertia';

interface AdminNavbarProps {
    title: string;
    onMenuToggle: () => void;
}

type OpenMenu = 'notifications' | 'messages' | null;

export function AdminNavbar({ title, onMenuToggle }: AdminNavbarProps) {
    const { auth, appName } = usePage().props;
    const user = auth.user;
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

    const initials =
        user?.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? 'AD';

    const unreadNotifications = adminNotifications.filter((item) => item.unread).length;
    const unreadMessages = adminMessages.filter((item) => item.unread).length;

    const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
        setOpenMenu((current) => (current === menu ? null : menu));
    };

    return (
        <header className="sticky top-0 z-30 overflow-visible border-b border-border bg-surface/95 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 overflow-visible px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="size-5" aria-hidden />
                    </button>

                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            {appName}
                        </p>
                        <h1 className="truncate font-heading text-lg font-semibold text-foreground sm:text-xl">
                            {title}
                        </h1>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 overflow-visible sm:gap-2.5">
                    <AdminNavbarDropdown
                        label="Notifications"
                        title="Notifications"
                        icon={<Bell className="size-4" aria-hidden />}
                        badge={unreadNotifications}
                        items={adminNotifications}
                        isOpen={openMenu === 'notifications'}
                        onToggle={() => toggleMenu('notifications')}
                        onClose={() => setOpenMenu(null)}
                        footerHref="/admin/inquiries"
                        footerLabel="View all activity"
                    />

                    <AdminNavbarDropdown
                        label="Messages"
                        title="Messages"
                        icon={<MessageSquare className="size-4" aria-hidden />}
                        badge={unreadMessages}
                        items={adminMessages}
                        isOpen={openMenu === 'messages'}
                        onToggle={() => toggleMenu('messages')}
                        onClose={() => setOpenMenu(null)}
                        footerHref="/admin/inquiries"
                        footerLabel="Open inquiries inbox"
                    />

                    <Link
                        href="/admin/settings"
                        aria-label="Profile"
                        className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <UserRound className="size-4" aria-hidden />
                    </Link>

                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        aria-label="Sign out"
                        className={cn(
                            'inline-flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus dark:text-red-400 dark:hover:bg-red-950/30',
                        )}
                    >
                        <LogOut className="size-4" aria-hidden />
                    </Link>

                    <div className="ms-1 hidden items-center gap-2 rounded-xl border border-border bg-surface-muted/70 px-2.5 py-1.5 sm:flex">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                            {initials}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
