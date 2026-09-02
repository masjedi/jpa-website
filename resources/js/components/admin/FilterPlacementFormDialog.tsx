import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { FilterPlacementEntityForm } from '@/components/admin/FilterPlacementEntityForm';
import {
    createEmptyFilterPlacementFormValues,
    type FilterPlacementFormValues,
} from '@/components/admin/filterPlacementForm';
import { tourFilterOptionTypeLabels } from '@/types/tourFilterOptions';

interface FilterPlacementFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: FilterPlacementFormValues;
    onClose: () => void;
    onSubmit: (values: FilterPlacementFormValues) => void | Promise<void>;
}

export function FilterPlacementFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: FilterPlacementFormDialogProps) {
    const formId = useId();
    const typeLabel = tourFilterOptionTypeLabels[initialValues?.type ?? 'region'].toLowerCase();
    const dialogTitle = mode === 'edit' ? `Edit ${typeLabel}` : `New ${typeLabel}`;
    const dialogDescription =
        mode === 'edit'
            ? 'Update this option used by tour listing filters and the tours form.'
            : 'Add an option for tour listing filters and the tours form.';

    const handleSubmit = async (values: FilterPlacementFormValues) => {
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
                <FilterPlacementEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={
                        initialValues ?? createEmptyFilterPlacementFormValues('region')
                    }
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
