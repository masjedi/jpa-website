import type { SiteSettings } from '@/components/public/brand';
import type { CustomBookingSuccess } from '@/types/customBooking';

export type TextDirection = 'ltr' | 'rtl';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface AdminNavbarFeedItem {
    id: string;
    title: string;
    description: string;
    time: string;
    href?: string | null;
    unread?: boolean;
}

export interface AdminFeed {
    notifications: AdminNavbarFeedItem[];
    messages: AdminNavbarFeedItem[];
    unreadNotifications: number;
    unreadMessages: number;
}

export interface SharedPageProps {
    locale: string;
    direction: TextDirection;
    locales: Record<string, { label: string; native: string }>;
    translations: import('@/hooks/use-translations').TranslationTree;
    appName: string;
    appUrl: string;
    siteSettings: SiteSettings;
    auth: {
        user: AuthUser | null;
    };
    flash: {
        success: string | null;
        error: string | null;
        customBookingSuccess: CustomBookingSuccess | null;
    };
    adminFeed?: AdminFeed | null;
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedPageProps {}
}
