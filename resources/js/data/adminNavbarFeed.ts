export interface AdminNavbarFeedItem {
    id: string;
    title: string;
    description: string;
    time: string;
    href?: string;
    unread?: boolean;
}

export const adminNotifications: AdminNavbarFeedItem[] = [
    {
        id: 'notif-1',
        title: 'New tour inquiry',
        description: 'Sarah Mitchell requested Bamiyan Heritage Journey.',
        time: '12 min ago',
        href: '/admin/inquiries',
        unread: true,
    },
    {
        id: 'notif-2',
        title: 'Invoice marked as paid',
        description: 'INV-1041 for Omar Hassani was updated.',
        time: '1 hour ago',
        href: '/admin/invoices',
        unread: true,
    },
    {
        id: 'notif-3',
        title: 'Content review reminder',
        description: 'Two destination drafts are waiting for review.',
        time: 'Yesterday',
        href: '/admin/destinations',
    },
];

export const adminMessages: AdminNavbarFeedItem[] = [
    {
        id: 'msg-1',
        title: 'Sarah Mitchell',
        description: 'Could you share a detailed itinerary for Bamiyan?',
        time: '18 min ago',
        href: '/admin/inquiries',
        unread: true,
    },
    {
        id: 'msg-2',
        title: 'Omar Hassani',
        description: 'We need airport pickup details for the Kabul weekend tour.',
        time: '3 hours ago',
        href: '/admin/inquiries',
        unread: true,
    },
    {
        id: 'msg-3',
        title: 'Elena Petrova',
        description: 'Is the Panjshir trek available in late September?',
        time: 'Yesterday',
        href: '/admin/inquiries',
        unread: true,
    },
];
