import { useId, useState } from 'react';

import { CustomBookingEntityForm } from '@/components/admin/CustomBookingEntityForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';

interface CustomBookingFormDialogProps {
    open: boolean;
    resetKey: string;
    reference: string;
    travelerName: string;
    email: string;
    accept: string;
    hint: string;
    maxFiles: number;
    onClose: () => void;
    onSubmit: (files: File[]) => void | Promise<void>;
}

export function CustomBookingFormDialog({
    open,
    resetKey,
    reference,
    travelerName,
    email,
    accept,
    hint,
    maxFiles,
    onClose,
    onSubmit,
}: CustomBookingFormDialogProps) {
    const formId = useId();
    const [submitError, setSubmitError] = useState<string | undefined>();

    const handleSubmit = async (files: File[]) => {
        setSubmitError(undefined);

        try {
            await onSubmit(files);
            onClose();
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Could not attach files. Check the file type and size.',
            );
        }
    };

    return (
        <DataTableDialog
            open={open}
            title={`Edit ${reference}`}
            description="Attach passports, itineraries, or other files for this request. Files stay in the dashboard and are not published on the website."
            onClose={onClose}
            size="lg"
        >
            {open ? (
                <CustomBookingEntityForm
                    key={resetKey}
                    formId={formId}
                    travelerName={travelerName}
                    email={email}
                    accept={accept}
                    hint={hint}
                    maxFiles={maxFiles}
                    error={submitError}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
