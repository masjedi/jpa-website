import {
    BookOpen,
    CircleHelp,
    Compass,
    FileText,
    Globe,
    Image,
    LayoutDashboard,
    Mail,
    Map,
    MessageSquareText,
    Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AdminNavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
}

export interface AdminNavGroup {
    label: string;
    icon: LucideIcon;
    items: AdminNavItem[];
}

export type AdminNavEntry =
    | ({ type: 'item' } & AdminNavItem)
    | ({ type: 'group' } & AdminNavGroup);

export const adminNavEntries: AdminNavEntry[] = [
    { type: 'item', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    {
        type: 'group',
        label: 'Public website',
        icon: Globe,
        items: [
            { label: 'Hero section', href: '/admin/hero-section', icon: Image },
            { label: 'Tours', href: '/admin/tours', icon: Map },
            { label: 'Destinations', href: '/admin/destinations', icon: Compass },
            { label: 'Articles', href: '/admin/articles', icon: BookOpen },
            { label: 'FAQ', href: '/admin/faq', icon: CircleHelp },
            { label: 'Subscriptions', href: '/admin/subscriptions', icon: Mail },
            {
                label: 'Inquiries',
                href: '/admin/inquiries',
                icon: MessageSquareText,
                badge: '3',
            },
        ],
    },
    { type: 'item', label: 'Invoices', href: '/admin/invoices', icon: FileText },
    { type: 'item', label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function isAdminNavActive(currentPath: string, href: string): boolean {
    if (currentPath === href) {
        return true;
    }

    return currentPath.startsWith(`${href}/`);
}

export function isAdminNavGroupActive(currentPath: string, items: AdminNavItem[]): boolean {
    return items.some((item) => isAdminNavActive(currentPath, item.href));
}
