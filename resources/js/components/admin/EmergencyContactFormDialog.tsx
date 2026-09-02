import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { EmergencyContactEntityForm } from '@/components/admin/EmergencyContactEntityForm';
import {
    createEmptyEmergencyContactFormValues,
    type EmergencyContactFormValues,
} from '@/components/admin/emergencyContactForm';
import type {
    EmergencyContactProvinceOption,
    EmergencyTypeOption,
} from '@/types/emergencyContacts';

interface EmergencyContactFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    provinces: readonly EmergencyContactProvinceOption[];
    emergencyTypes: readonly EmergencyTypeOption[];
    statusOptions?: readonly string[];
    initialValues?: EmergencyContactFormValues;
    onClose: () => void;
    onSubmit: (values: EmergencyContactFormValues) => void | Promise<void>;
}

export function EmergencyContactFormDialog({
    open,
    mode,
    resetKey,
    provinces,
    emergencyTypes,
    statusOptions,
    initialValues,
    onClose,
    onSubmit,
}: EmergencyContactFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit emergency contact' : 'New emergency contact';
    const dialogDescription =
        mode === 'edit'
            ? 'Update a verified provincial contact. Internal notes stay in the dashboard.'
            : 'Add a verified provincial contact for operational use. This directory is not shown on the public website.';

    const handleSubmit = async (values: EmergencyContactFormValues) => {
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
                <EmergencyContactEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    provinces={provinces}
                    emergencyTypes={emergencyTypes}
                    statusOptions={statusOptions}
                    initialValues={initialValues ?? createEmptyEmergencyContactFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
