import { Head } from '@inertiajs/react';
import { FileText, Plus } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface InvoiceRow {
    id: string;
    client: string;
    tour: string;
    amount: string;
    status: 'Sent' | 'Paid' | 'Draft' | 'Overdue';
    issued: string;
}

const mockInvoices: InvoiceRow[] = [
    {
        id: 'INV-1042',
        client: 'Sarah Mitchell',
        tour: 'Bamiyan Heritage Journey',
        amount: '$2,450',
        status: 'Sent',
        issued: 'Aug 12, 2026',
    },
    {
        id: 'INV-1041',
        client: 'Omar Hassani',
        tour: 'Kabul Cultural Weekend',
        amount: '$980',
        status: 'Paid',
        issued: 'Aug 10, 2026',
    },
    {
        id: 'INV-1040',
        client: 'Elena Petrova',
        tour: 'Panjshir Valley Trek',
        amount: '$3,120',
        status: 'Draft',
        issued: 'Aug 8, 2026',
    },
    {
        id: 'INV-1039',
        client: 'Daniel Weber',
        tour: 'Herat Art and Heritage',
        amount: '$1,760',
        status: 'Overdue',
        issued: 'Aug 4, 2026',
    },
    {
        id: 'INV-1038',
        client: 'Amina Rahimi',
        tour: 'Mazar and Balkh Discovery',
        amount: '$1,290',
        status: 'Paid',
        issued: 'Jul 30, 2026',
    },
    {
        id: 'INV-1037',
        client: 'Thomas Lee',
        tour: 'Wakhan Explorer',
        amount: '$4,850',
        status: 'Sent',
        issued: 'Jul 25, 2026',
    },
    {
        id: 'INV-1036',
        client: 'Nadia Collins',
        tour: 'Kabul Cultural Weekend',
        amount: '$1,120',
        status: 'Draft',
        issued: 'Jul 21, 2026',
    },
];

const statusStyles: Record<InvoiceRow['status'], string> = {
    Sent: 'bg-secondary/10 text-secondary',
    Paid: 'bg-primary/10 text-primary',
    Draft: 'bg-accent/15 text-accent',
    Overdue: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const columns: DataTableColumn<InvoiceRow>[] = [
    {
        id: 'invoice',
        header: 'Invoice',
        accessor: (row) => row.id,
        render: (row) => <span className="font-semibold text-foreground">{row.id}</span>,
    },
    { id: 'client', header: 'Client', accessor: (row) => row.client },
    { id: 'tour', header: 'Tour', accessor: (row) => row.tour },
    {
        id: 'amount',
        header: 'Amount',
        accessor: (row) => row.amount,
        align: 'end',
        render: (row) => <span className="font-medium text-foreground">{row.amount}</span>,
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
    { id: 'issued', header: 'Issued', accessor: (row) => row.issued },
];

export default function Invoices() {
    return (
        <>
            <Head title="Invoices" />

            <div className="space-y-4">
                <AdminSectionHeader
                    eyebrow="Finance"
                    title="Invoices"
                    description="Prepare quotations and invoices for confirmed trip planning. This area supports documentation only — not online payment processing."
                    icon={FileText}
                    actions={
                        <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground opacity-70"
                        >
                            <Plus className="size-4" aria-hidden />
                            New invoice
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Invoice register"
                    description="Sample records for the UX phase. Live invoice workflows will connect here later."
                    data={mockInvoices}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => `${row.id} — ${row.client}`}
                    initialPageSize={5}
                />
            </div>
        </>
    );
}

Invoices.layout = withAdminLayout('Invoices');
