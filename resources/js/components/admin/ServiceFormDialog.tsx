import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { ServiceEntityForm } from '@/components/admin/ServiceEntityForm';
import {
    createEmptyServiceFormValues,
    type ServiceFormValues,
} from '@/components/admin/serviceForm';
import type { ServiceCategory, ServiceIconOption } from '@/types/services';

interface ServiceFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    iconOptions: readonly ServiceIconOption[];
    categoryOptions: readonly ServiceCategory[];
    initialValues?: ServiceFormValues;
    onClose: () => void;
    onSubmit: (values: ServiceFormValues) => void | Promise<void>;
}

export function ServiceFormDialog({
    open,
    mode,
    resetKey,
    iconOptions,
    categoryOptions,
    initialValues,
    onClose,
    onSubmit,
}: ServiceFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit service' : 'New service';
    const dialogDescription =
        mode === 'edit'
            ? 'Update this offering on the public services page and homepage.'
            : 'Add an offering shown on the public services page.';

    const handleSubmit = async (values: ServiceFormValues) => {
        await onSubmit(values);
        onClose();
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
                <ServiceEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    iconOptions={iconOptions}
                    categoryOptions={categoryOptions}
                    initialValues={
                        initialValues
                        ?? createEmptyServiceFormValues(iconOptions, categoryOptions)
                    }
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
