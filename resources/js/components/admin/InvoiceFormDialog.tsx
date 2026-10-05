import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { InvoiceEntityForm } from '@/components/admin/InvoiceEntityForm';
import {
    createEmptyInvoiceFormValues,
    type InvoiceFormValues,
} from '@/components/admin/invoiceForm';

interface InvoiceFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: InvoiceFormValues;
    onClose: () => void;
    onSubmit: (values: InvoiceFormValues) => void | Promise<void>;
}

export function InvoiceFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: InvoiceFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit invoice' : 'New invoice';
    const dialogDescription =
        mode === 'edit'
            ? 'Update client, services, and totals. The invoice number stays unchanged.'
            : 'Prepare a quotation or invoice. This does not collect online payment.';

    const handleSubmit = async (values: InvoiceFormValues) => {
        await onSubmit(values);
    };

    return (
        <DataTableDialog
            open={open}
            title={dialogTitle}
            description={dialogDescription}
            onClose={onClose}
            size="lg"
        >
            {open ? (
                <InvoiceEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyInvoiceFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
