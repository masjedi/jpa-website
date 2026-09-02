import {
    BookOpen,
    Briefcase,
    CircleHelp,
    ClipboardList,
    Compass,
    FileText,
    Filter,
    Globe,
    Image,
    Info,
    LayoutDashboard,
    Mail,
    Map,
    MessageSquareQuote,
    MessageSquareText,
    Phone,
    Search,
    Settings,
    SlidersHorizontal,
    Users,
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
            { label: 'Services', href: '/admin/services', icon: Briefcase },
            { label: 'About page', href: '/admin/about', icon: Info },
            { label: 'Articles', href: '/admin/articles', icon: BookOpen },
            { label: 'Gallery', href: '/admin/gallery', icon: Image },
            { label: 'FAQ', href: '/admin/faq', icon: CircleHelp },
            { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
            { label: 'Teams', href: '/admin/teams', icon: Users },
            { label: 'Subscriptions', href: '/admin/subscriptions', icon: Mail },
            {
                label: 'Inquiries',
                href: '/admin/inquiries',
                icon: MessageSquareText,
                badge: '3',
            },
            { label: 'Custom bookings', href: '/admin/bookings', icon: ClipboardList },
        ],
    },
    { type: 'item', label: 'Invoices', href: '/admin/invoices', icon: FileText },
    {
        type: 'group',
        label: 'Configuration',
        icon: SlidersHorizontal,
        items: [
            { label: 'Filter & Placement', href: '/admin/filter-placement', icon: Filter },
            { label: 'Home finder', href: '/admin/home-finder', icon: Search },
            { label: 'Emergency Contacts', href: '/admin/emergency-contacts', icon: Phone },
        ],
    },
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
