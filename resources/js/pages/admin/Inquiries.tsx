import { router, usePage } from '@inertiajs/react';
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
    {
        id: 'tour',
        header: 'Subject / Package',
        accessor: (row) => row.tour,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.tour}</p>
                {row.isSeasonalPackage && row.packagePrice ? (
                    <p className="text-xs text-muted-foreground">Price: {row.packagePrice}</p>
                ) : null}
            </div>
        ),
    },
    {
        id: 'source',
        header: 'Source',
        accessor: (row) => row.source,
        render: (row) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    row.isSeasonalPackage
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-surface-muted text-muted-foreground'
                }`}
            >
                {row.isSeasonalPackage ? 'Seasonal package' : row.source}
            </span>
        ),
    },
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
                    description="Contact messages and general tour inquiries. Custom tour and seasonal package booking requests appear under Tour bookings."
                    icon={MessageSquareText}
                />

                <PremiumDataTable
                    title="Recent inquiries"
                    description="Contact form messages and tour inquiry submissions from the public site."
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
