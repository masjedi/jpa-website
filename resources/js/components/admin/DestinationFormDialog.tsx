import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { DestinationEntityForm } from '@/components/admin/DestinationEntityForm';
import {
    createEmptyDestinationFormValues,
    type DestinationFormSubmitPayload,
    type DestinationFormValues,
} from '@/components/admin/destinationForm';

interface DestinationFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: DestinationFormValues;
    onClose: () => void;
    onSubmit: (payload: DestinationFormSubmitPayload) => void | Promise<void>;
}

export function DestinationFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: DestinationFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit destination' : 'New destination';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the destination details shown on the public website.'
            : 'Add a new destination to the public website catalog.';

    const handleSubmit = (payload: DestinationFormSubmitPayload) => onSubmit(payload);

    return (
        <DataTableDialog
            open={open}
            title={dialogTitle}
            description={dialogDescription}
            onClose={onClose}
            size="xl"
        >
            {open ? (
                <DestinationEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyDestinationFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
