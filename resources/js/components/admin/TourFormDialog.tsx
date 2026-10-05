import { useId } from 'react';

import {
    createEmptyTourFormValues,
    type TourFormSubmitPayload,
    type TourFormValues,
} from '@/components/admin/tourForm';
import { TourEntityForm } from '@/components/admin/TourEntityForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';

interface TourFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: TourFormValues;
    filterOptions: TourFilterFieldOptions;
    onClose: () => void;
    onSubmit: (payload: TourFormSubmitPayload) => void | Promise<void>;
}

export function TourFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    filterOptions,
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
            : 'Add a tour itinerary or travel package with the same fields used on the public site.';

    const handleSubmit = (payload: TourFormSubmitPayload) => onSubmit(payload);

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
                    initialValues={initialValues ?? createEmptyTourFormValues(filterOptions)}
                    filterOptions={filterOptions}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
