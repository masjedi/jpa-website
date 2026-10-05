import { Head, router, usePage } from '@inertiajs/react';
import { FileText, Plus } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    buildInvoicePayload,
    invoiceToFormValues,
    type InvoiceDetail,
    type InvoiceFormValues,
} from '@/components/admin/invoiceForm';
import { InvoiceViewDialog } from '@/components/admin/InvoiceViewDialog';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { SharedPageProps } from '@/types/inertia';

const InvoiceFormDialog = lazy(() =>
    import('@/components/admin/InvoiceFormDialog').then((module) => ({
        default: module.InvoiceFormDialog,
    })),
);

type InvoiceRow = InvoiceDetail;

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
        accessor: (row) => row.number,
        render: (row) => <span className="font-semibold text-foreground">{row.number}</span>,
    },
    {
        id: 'client',
        header: 'Client',
        accessor: (row) => row.client,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.client}</p>
                <p className="text-xs text-muted-foreground">{row.clientEmail}</p>
            </div>
        ),
    },
    { id: 'tour', header: 'Tour', accessor: (row) => row.tour || '—' },
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

interface InvoicesPageProps extends SharedPageProps {
    invoices: InvoiceRow[];
}

function submitInvoiceForm(
    values: InvoiceFormValues,
    editingInvoiceId: number | null,
): Promise<void> {
    const payload = buildInvoicePayload(values);

    return new Promise((resolve, reject) => {
        const options = {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: () => reject(),
        };

        if (editingInvoiceId !== null) {
            router.patch(`/admin/invoices/${editingInvoiceId}`, payload, options);

            return;
        }

        router.post('/admin/invoices', payload, options);
    });
}

export default function Invoices() {
    const { invoices = [], flash } = usePage<InvoicesPageProps>().props;
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [formResetKey, setFormResetKey] = useState('create');
    const [editingInvoice, setEditingInvoice] = useState<InvoiceRow | null>(null);
    const [viewingInvoice, setViewingInvoice] = useState<InvoiceRow | null>(null);

    const openCreateDialog = () => {
        setFormMode('create');
        setEditingInvoice(null);
        setFormResetKey(`create-${Date.now()}`);
        setFormOpen(true);
    };

    const openEditDialog = (invoice: InvoiceRow) => {
        setFormMode('edit');
        setEditingInvoice(invoice);
        setFormResetKey(`edit-${invoice.id}-${Date.now()}`);
        setFormOpen(true);
    };

    const handleDeleteInvoice = (row: InvoiceRow) => {
        router.delete(`/admin/invoices/${row.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Invoices" />

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
                    eyebrow="Finance"
                    title="Invoices"
                    description="Prepare quotations and invoices for confirmed trip planning. This area supports documentation only — not online payment processing."
                    icon={FileText}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateDialog}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <Plus className="size-4" aria-hidden />
                            New invoice
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Invoice register"
                    description="Create, preview and print branded invoices with rich-text service descriptions."
                    data={invoices}
                    columns={columns}
                    rowKey={(row) => String(row.id)}
                    selectionLabel={(row) => `${row.number} — ${row.client}`}
                    initialPageSize={5}
                    onView={(row) => setViewingInvoice(row)}
                    onEdit={(row) => openEditDialog(row)}
                    onDelete={handleDeleteInvoice}
                />
            </div>

            <Suspense fallback={null}>
                <InvoiceFormDialog
                    open={formOpen}
                    mode={formMode}
                    resetKey={formResetKey}
                    initialValues={
                        editingInvoice ? invoiceToFormValues(editingInvoice) : undefined
                    }
                    onClose={() => setFormOpen(false)}
                    onSubmit={(values) =>
                        submitInvoiceForm(values, editingInvoice?.id ?? null)
                    }
                />
            </Suspense>

            <InvoiceViewDialog
                open={viewingInvoice !== null}
                invoice={viewingInvoice}
                onClose={() => setViewingInvoice(null)}
            />
        </>
    );
}

Invoices.layout = withAdminLayout('Invoices');
