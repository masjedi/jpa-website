import { useId } from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { TeamEntityForm } from '@/components/admin/TeamEntityForm';
import type { TeamAvatarSpec } from '@/types/team';
import type { TeamFormSubmitPayload, TeamFormValues } from '@/components/admin/teamForm';

interface TeamFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    avatarSpec: TeamAvatarSpec;
    initialValues?: TeamFormValues;
    onClose: () => void;
    onSubmit: (payload: TeamFormSubmitPayload) => void | Promise<void>;
}

export function TeamFormDialog({
    open,
    mode,
    resetKey,
    avatarSpec,
    initialValues,
    onClose,
    onSubmit,
}: TeamFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit team member' : 'New team member';
    const dialogDescription =
        mode === 'edit'
            ? 'Update profile details shown on the public Our Team page.'
            : 'Add a team member profile to the public Our Team page.';

    const handleSubmit = async (payload: TeamFormSubmitPayload) => {
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
                <TeamEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    avatarSpec={avatarSpec}
                    initialValues={initialValues}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
