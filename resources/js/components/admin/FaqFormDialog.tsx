import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { FaqEntityForm } from '@/components/admin/FaqEntityForm';
import { createEmptyFaqFormValues, type FaqFormValues } from '@/components/admin/faqForm';

interface FaqFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: FaqFormValues;
    onClose: () => void;
    onSubmit: (values: FaqFormValues) => void | Promise<void>;
}

export function FaqFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: FaqFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit FAQ' : 'New FAQ';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the question and answer shown in the homepage travel information section.'
            : 'Add a new frequently asked question to the public website.';

    const handleSubmit = async (values: FaqFormValues) => {
        await onSubmit(values);
        onClose();
    };

    return (
        <DataTableDialog
            open={open}
            title={dialogTitle}
            description={dialogDescription}
            onClose={onClose}
            size="md"
        >
            {open ? (
                <FaqEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyFaqFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
