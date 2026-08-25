import { useId } from 'react';

import { AboutContentEditor } from '@/components/admin/AboutContentEditor';
import type { AboutContentFormValues } from '@/components/admin/aboutPageForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';
import type { AboutPageContent } from '@/types/aboutPage';

interface AboutContentFormDialogProps {
    open: boolean;
    content: AboutPageContent;
    onClose: () => void;
    onSave: (values: AboutContentFormValues) => void | Promise<void>;
}

export function AboutContentFormDialog({
    open,
    content,
    onClose,
    onSave,
}: AboutContentFormDialogProps) {
    const formId = useId();
    const resetKey = `${content.intro.title}-${content.missionVision.mission.title}-${content.cta.title}`;

    const handleSave = async (values: AboutContentFormValues) => {
        await onSave(values);
        onClose();
    };

    return (
        <DataTableDialog
            open={open}
            title="Edit page content"
            description="Update the About page intro, mission & vision block, and closing call to action."
            onClose={onClose}
            size="lg"
        >
            {open ? (
                <AboutContentEditor
                    key={resetKey}
                    formId={formId}
                    content={content}
                    onCancel={onClose}
                    onSave={handleSave}
                />
            ) : null}
        </DataTableDialog>
    );
}
