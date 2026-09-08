import { usePage } from '@inertiajs/react';
import { useId } from 'react';

import { ArticleEntityForm } from '@/components/admin/ArticleEntityForm';
import {
    createEmptyArticleFormValues,
    type ArticleFormSubmitPayload,
    type ArticleFormValues,
    type ArticleTeamMemberOption,
} from '@/components/admin/articleForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';

interface ArticleFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    teamMembers: readonly ArticleTeamMemberOption[];
    initialValues?: ArticleFormValues;
    onClose: () => void;
    onSubmit: (payload: ArticleFormSubmitPayload) => void | Promise<void>;
}

export function ArticleFormDialog({
    open,
    mode,
    resetKey,
    teamMembers,
    initialValues,
    onClose,
    onSubmit,
}: ArticleFormDialogProps) {
    const formId = useId();
    const defaultAuthorName = usePage().props.auth.user?.name ?? '';
    const dialogTitle = mode === 'edit' ? 'Edit article' : 'New article';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the article details shown on the public website.'
            : 'Add a new article to the public editorial library.';

    const handleSubmit = async (payload: ArticleFormSubmitPayload) => {
        await onSubmit(payload);
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
                <ArticleEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    teamMembers={teamMembers}
                    initialValues={
                        initialValues ?? createEmptyArticleFormValues(teamMembers, defaultAuthorName)
                    }
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
