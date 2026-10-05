import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { TestimonialEntityForm } from '@/components/admin/TestimonialEntityForm';
import {
    createEmptyTestimonialFormValues,
    type TestimonialFormSubmitPayload,
    type TestimonialFormValues,
} from '@/components/admin/testimonialForm';

interface TestimonialFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: TestimonialFormValues;
    uploadHint: string;
    onClose: () => void;
    onSubmit: (payload: TestimonialFormSubmitPayload) => void | Promise<void>;
}

export function TestimonialFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    uploadHint,
    onClose,
    onSubmit,
}: TestimonialFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit testimonial' : 'New testimonial';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the traveller quote shown in the homepage carousel.'
            : 'Add a new traveller testimonial to the public homepage.';

    const handleSubmit = async (payload: TestimonialFormSubmitPayload) => {
        await onSubmit(payload);
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
                <TestimonialEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyTestimonialFormValues()}
                    uploadHint={uploadHint}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
