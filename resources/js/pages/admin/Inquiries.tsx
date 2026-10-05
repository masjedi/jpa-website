import { Head, router, usePage } from '@inertiajs/react';
import { MessageSquareText } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    InquiryViewDialog,
    type InquiryDetail,
} from '@/components/admin/InquiryViewDialog';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { SharedPageProps } from '@/types/inertia';

type InquiryRow = InquiryDetail;

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
    { id: 'tour', header: 'Subject', accessor: (row) => row.tour },
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
    { id: 'received', header: 'Received', accessor: (row) => row.received },
];

interface InquiriesPageProps extends SharedPageProps {
    inquiries: InquiryRow[];
}

export default function Inquiries() {
    const { inquiries = [], flash } = usePage<InquiriesPageProps>().props;
    const [viewingInquiry, setViewingInquiry] = useState<InquiryRow | null>(null);

    const handleDeleteInquiry = (row: InquiryRow) => {
        router.delete(`/admin/inquiries/${row.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Inquiries" />

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
                    title="Inquiries"
                    description="Review traveler booking requests, contact messages, and follow-up status. Inquiries are requests only — not confirmed reservations."
                    icon={MessageSquareText}
                />

                <PremiumDataTable
                    title="Recent inquiries"
                    description="Messages from the contact form and tour inquiry requests, newest first."
                    data={inquiries}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.name}
                    initialPageSize={5}
                    onView={(row) => setViewingInquiry(row)}
                    onDelete={handleDeleteInquiry}
                />
            </div>

            <InquiryViewDialog
                open={viewingInquiry !== null}
                inquiry={viewingInquiry}
                onClose={() => setViewingInquiry(null)}
            />
        </>
    );
}

Inquiries.layout = withAdminLayout('Inquiries');
