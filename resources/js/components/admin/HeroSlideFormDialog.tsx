import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { HeroSlideEntityForm } from '@/components/admin/HeroSlideEntityForm';
import {
    createEmptyHeroSlideFormValues,
    type HeroSlideFormValues,
} from '@/components/admin/heroSlideForm';

interface HeroSlideFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: HeroSlideFormValues;
    onClose: () => void;
    onSubmit: (values: HeroSlideFormValues) => void | Promise<void>;
}

export function HeroSlideFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: HeroSlideFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit hero slide' : 'New hero slide';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the headline and subtitle shown in the homepage hero carousel.'
            : 'Add a new rotating message to the homepage hero carousel.';

    const handleSubmit = async (values: HeroSlideFormValues) => {
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
                <HeroSlideEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyHeroSlideFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
