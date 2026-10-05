import { useId } from 'react';

import { AboutJourneyStepEntityForm } from '@/components/admin/AboutJourneyStepEntityForm';
import {
    createEmptyAboutJourneyStepFormValues,
    type AboutJourneyStepFormValues,
    type AboutJourneyStepSubmitPayload,
} from '@/components/admin/aboutJourneyStepForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';
import type { AboutIconOption } from '@/types/aboutPage';

interface AboutJourneyStepFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    iconOptions: readonly AboutIconOption[];
    initialValues?: AboutJourneyStepFormValues;
    onClose: () => void;
    onSubmit: (payload: AboutJourneyStepSubmitPayload) => void | Promise<void>;
}

export function AboutJourneyStepFormDialog({
    open,
    mode,
    resetKey,
    iconOptions,
    initialValues,
    onClose,
    onSubmit,
}: AboutJourneyStepFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit journey step' : 'New journey step';
    const dialogDescription =
        mode === 'edit'
            ? 'Update this milestone in the About page journey timeline.'
            : 'Add a new step to the About page journey timeline.';

    const handleSubmit = async (payload: AboutJourneyStepSubmitPayload) => {
        await onSubmit(payload);
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
                <AboutJourneyStepEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    iconOptions={iconOptions}
                    initialValues={initialValues ?? createEmptyAboutJourneyStepFormValues(iconOptions)}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
