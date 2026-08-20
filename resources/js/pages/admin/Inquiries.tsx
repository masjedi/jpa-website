import { Head } from '@inertiajs/react';
import { MessageSquareText } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface InquiryRow {
    id: number;
    name: string;
    email: string;
    tour: string;
    status: 'New' | 'In review' | 'Awaiting reply' | 'Closed';
    received: string;
}

const mockInquiries: InquiryRow[] = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        email: 'sarah@example.com',
        tour: 'Bamiyan Heritage Journey',
        status: 'New',
        received: '2 hours ago',
    },
    {
        id: 2,
        name: 'Omar Hassani',
        email: 'omar@example.com',
        tour: 'Kabul Cultural Weekend',
        status: 'In review',
        received: 'Yesterday',
    },
    {
        id: 3,
        name: 'Elena Petrova',
        email: 'elena@example.com',
        tour: 'Panjshir Valley Trek',
        status: 'Awaiting reply',
        received: '2 days ago',
    },
    {
        id: 4,
        name: 'Daniel Weber',
        email: 'daniel@example.com',
        tour: 'Herat Art and Heritage',
        status: 'New',
        received: '3 days ago',
    },
    {
        id: 5,
        name: 'Amina Rahimi',
        email: 'amina@example.com',
        tour: 'Mazar and Balkh Discovery',
        status: 'Closed',
        received: '4 days ago',
    },
    {
        id: 6,
        name: 'Thomas Lee',
        email: 'thomas@example.com',
        tour: 'Wakhan Explorer',
        status: 'In review',
        received: '5 days ago',
    },
    {
        id: 7,
        name: 'Nadia Collins',
        email: 'nadia@example.com',
        tour: 'Kabul Cultural Weekend',
        status: 'Awaiting reply',
        received: '1 week ago',
    },
];

const statusStyles: Record<InquiryRow['status'], string> = {
    New: 'bg-accent/15 text-accent',
    'In review': 'bg-secondary/10 text-secondary',
    'Awaiting reply': 'bg-primary/10 text-primary',
    Closed: 'bg-surface-muted text-muted-foreground',
};

const columns: DataTableColumn<InquiryRow>[] = [
    {
        id: 'traveler',
        header: 'Traveler',
        accessor: (row) => row.name,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
            </div>
        ),
    },
    { id: 'email', header: 'Email', accessor: (row) => row.email },
    { id: 'tour', header: 'Tour', accessor: (row) => row.tour },
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
    { id: 'received', header: 'Received', accessor: (row) => row.received },
];

export default function Inquiries() {
    return (
        <>
            <Head title="Inquiries" />

            <div className="space-y-6">
                <AdminSectionHeader
                    eyebrow="Operations"
                    title="Inquiries"
                    description="Review traveler booking requests, contact messages, and follow-up status. Inquiries are requests only — not confirmed reservations."
                    icon={MessageSquareText}
                />

                <PremiumDataTable
                    title="Recent inquiries"
                    description="Sample records for the UX phase. Live inquiry intake will connect here later."
                    data={mockInquiries}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.name}
                    initialPageSize={5}
                />
            </div>
        </>
    );
}

Inquiries.layout = withAdminLayout('Inquiries');
