import { useId } from 'react';

import { ArticleEntityForm } from '@/components/admin/ArticleEntityForm';
import {
    createEmptyArticleFormValues,
    type ArticleFormValues,
} from '@/components/admin/articleForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';

interface ArticleFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialValues?: ArticleFormValues;
    onClose: () => void;
    onSubmit: (values: ArticleFormValues) => void | Promise<void>;
}

export function ArticleFormDialog({
    open,
    mode,
    resetKey,
    initialValues,
    onClose,
    onSubmit,
}: ArticleFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit article' : 'New article';
    const dialogDescription =
        mode === 'edit'
            ? 'Update the article details shown on the public website.'
            : 'Add a new article to the public editorial library.';

    const handleSubmit = async (values: ArticleFormValues) => {
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
                <ArticleEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialValues={initialValues ?? createEmptyArticleFormValues()}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
