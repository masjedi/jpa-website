import {
    BookOpen,
    Compass,
    FileText,
    LayoutDashboard,
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

export const adminNavItems: AdminNavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Tours', href: '/admin/tours', icon: Map },
    { label: 'Destinations', href: '/admin/destinations', icon: Compass },
    { label: 'Articles', href: '/admin/articles', icon: BookOpen },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquareText, badge: '3' },
    { label: 'Invoices', href: '/admin/invoices', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function isAdminNavActive(currentPath: string, href: string): boolean {
    if (currentPath === href) {
        return true;
    }

    return currentPath.startsWith(`${href}/`);
}
