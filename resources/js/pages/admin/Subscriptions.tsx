import { router, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { SharedPageProps } from '@/types/inertia';

interface SubscriptionRow {
    id: number;
    email: string;
    source: 'Footer' | 'Articles page';
    status: 'Active' | 'Unsubscribed';
    subscribed: string;
}

const statusStyles: Record<SubscriptionRow['status'], string> = {
    Active: 'bg-secondary/10 text-secondary',
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

interface SubscriptionsPageProps extends SharedPageProps {
    subscriptions: SubscriptionRow[];
}

export default function Subscriptions() {
    const { subscriptions = [], flash } = usePage<SubscriptionsPageProps>().props;

    const handleDeleteSubscription = (row: SubscriptionRow) => {
        router.delete(`/admin/subscriptions/${row.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <div className="space-y-4">
                {flash.success ? (
                    <div
                        role="status"
                        className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                    >
                        {flash.success}
                    </div>
                ) : null}

                <AdminSectionHeader
                    eyebrow="Public website"
                    title="Subscriptions"
                    description="Review newsletter sign-ups collected from the public website. Subscribers receive travel notes and article updates — not booking confirmations."
                    icon={Mail}
                />

                <PremiumDataTable
                    title="Newsletter subscribers"
                    description="Emails collected from public newsletter forms across the website."
                    data={subscriptions}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.email}
                    initialPageSize={5}
                    onDelete={handleDeleteSubscription}
                />
            </div>
        </>
    );
}

Subscriptions.layout = withAdminLayout('Subscriptions');
