import { useId } from 'react';

import {
    createEmptyTourFormValues,
    type TourFormValues,
} from '@/components/admin/tourForm';
import { TourEntityForm } from '@/components/admin/TourEntityForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';

interface TourFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: TourFormValues;
    onClose: () => void;
    onSubmit: (values: TourFormValues) => void | Promise<void>;
}

export function TourFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: TourFormDialogProps) {
    const formId = useId();
    const dialogTitle =
        mode === 'edit'
            ? 'Edit listing'
            : initialValues?.listingType === 'package'
              ? 'New package'
              : 'New tour';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the listing details shown on the public tours and packages pages.'
            : 'Add a tour itinerary or travel package with the fields used by the public filters and cards.';

    const handleSubmit = async (values: TourFormValues) => {
        await onSubmit(values);
        onClose();
    };

    return (
        <DataTableDialog
            open={open}
            title={dialogTitle}
            description={dialogDescription}
            onClose={onClose}
            size="xl"
        >
            {open ? (
                <TourEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyTourFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
