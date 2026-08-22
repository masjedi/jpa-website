import { Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface SubscriptionRow {
    id: number;
    email: string;
    source: 'Home page' | 'Articles page' | 'Footer';
    status: 'Active' | 'Pending' | 'Unsubscribed';
    subscribed: string;
}

const mockSubscriptions: SubscriptionRow[] = [
    {
        id: 1,
        email: 'sarah.mitchell@example.com',
        source: 'Home page',
        status: 'Active',
        subscribed: '2 hours ago',
    },
    {
        id: 2,
        email: 'omar.hassani@example.com',
        source: 'Articles page',
        status: 'Active',
        subscribed: 'Yesterday',
    },
    {
        id: 3,
        email: 'elena.petrova@example.com',
        source: 'Home page',
        status: 'Pending',
        subscribed: 'Yesterday',
    },
    {
        id: 4,
        email: 'daniel.weber@example.com',
        source: 'Articles page',
        status: 'Active',
        subscribed: '3 days ago',
    },
    {
        id: 5,
        email: 'amina.rahimi@example.com',
        source: 'Footer',
        status: 'Unsubscribed',
        subscribed: '4 days ago',
    },
    {
        id: 6,
        email: 'thomas.lee@example.com',
        source: 'Home page',
        status: 'Active',
        subscribed: '5 days ago',
    },
    {
        id: 7,
        email: 'nadia.collins@example.com',
        source: 'Articles page',
        status: 'Active',
        subscribed: '1 week ago',
    },
    {
        id: 8,
        email: 'james.carter@example.com',
        source: 'Footer',
        status: 'Pending',
        subscribed: '1 week ago',
    },
];

const statusStyles: Record<SubscriptionRow['status'], string> = {
    Active: 'bg-secondary/10 text-secondary',
    Pending: 'bg-accent/15 text-accent',
    Unsubscribed: 'bg-surface-muted text-muted-foreground',
};

const columns: DataTableColumn<SubscriptionRow>[] = [
    {
        id: 'subscriber',
        header: 'Subscriber',
        accessor: (row) => row.email,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.email}</p>
                <p className="text-xs text-muted-foreground">{row.source}</p>
            </div>
        ),
    },
    { id: 'email', header: 'Email', accessor: (row) => row.email },
    { id: 'source', header: 'Source', accessor: (row) => row.source },
    {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status]}`}
            >
                {row.status}
            </span>
        ),
    },
    { id: 'subscribed', header: 'Subscribed', accessor: (row) => row.subscribed },
];

export default function Subscriptions() {
    return (
        <>
            <Head title="Subscriptions" />

            <div className="space-y-4">
                <AdminSectionHeader
                    eyebrow="Public website"
                    title="Subscriptions"
                    description="Review newsletter sign-ups collected from the public website. Subscribers receive travel notes and article updates — not booking confirmations."
                    icon={Mail}
                />

                <PremiumDataTable
                    title="Newsletter subscribers"
                    description="Sample records for the UX phase. Live subscription intake will connect here later."
                    data={mockSubscriptions}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.email}
                    initialPageSize={5}
                />
            </div>
        </>
    );
}

Subscriptions.layout = withAdminLayout('Subscriptions');
