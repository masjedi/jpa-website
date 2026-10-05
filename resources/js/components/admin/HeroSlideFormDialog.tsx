import { useId, useState } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { HeroSlideEntityForm } from '@/components/admin/HeroSlideEntityForm';
import {
    createEmptyHeroSlideFormValues,
    type HeroSlideFormValues,
    type HeroSlideSubmitPayload,
} from '@/components/admin/heroSlideForm';

interface HeroSlideFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: HeroSlideFormValues;
    onClose: () => void;
    onSubmit: (payload: HeroSlideSubmitPayload) => void | Promise<void>;
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
    const [submitting, setSubmitting] = useState(false);
    const dialogTitle = mode === 'edit' ? 'Edit hero slide' : 'New hero slide';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the headline, subtitle, and full-screen background image shown in the homepage hero carousel.'
            : 'Add a new rotating hero slide with a full-screen background image, headline, and subtitle.';

    const handleSubmit = async (payload: HeroSlideSubmitPayload) => {
        setSubmitting(true);

        try {
            await onSubmit(payload);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DataTableDialog
            open={open}
            title={dialogTitle}
            description={dialogDescription}
            onClose={onClose}
            size="lg"
            preventDismiss={submitting}
            loadingMessage="Saving hero slide. The image is uploading and being processed — please keep this window open."
        >
            {open ? (
                <HeroSlideEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyHeroSlideFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                    onSubmittingChange={setSubmitting}
                />
            ) : null}
        </DataTableDialog>
    );
}
