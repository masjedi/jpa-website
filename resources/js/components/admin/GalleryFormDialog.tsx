import { useId } from 'react';

import { GalleryEntityForm } from '@/components/admin/GalleryEntityForm';
import {
    createEmptyGalleryEditFormValues,
    type GalleryBulkFormSubmitPayload,
    type GalleryEditFormSubmitPayload,
    type GalleryEditFormValues,
} from '@/components/admin/galleryForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';

interface GalleryFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    resetKey: string;
    initialEditValues?: GalleryEditFormValues;
    onClose: () => void;
    onSubmitBulk: (payload: GalleryBulkFormSubmitPayload) => void | Promise<void>;
    onSubmitEdit: (payload: GalleryEditFormSubmitPayload) => void | Promise<void>;
}

export function GalleryFormDialog({
    open,
    mode,
    resetKey,
    initialEditValues,
    onClose,
    onSubmitBulk,
    onSubmitEdit,
}: GalleryFormDialogProps) {
    const formId = useId();
    const dialogTitle = mode === 'edit' ? 'Edit gallery photo' : 'Upload gallery photos';
    const dialogDescription =
        mode === 'edit'
            ? 'Update caption, alt text, sort order, or replace the image.'
            : 'Add one or more photos to the public gallery. You can refine each photo after upload.';

    const handleSubmitBulk = async (payload: GalleryBulkFormSubmitPayload) => {
        await onSubmitBulk(payload);
        onClose();
    };

    const handleSubmitEdit = async (payload: GalleryEditFormSubmitPayload) => {
        await onSubmitEdit(payload);
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
                <GalleryEntityForm
                    key={resetKey}
                    formId={formId}
                    mode={mode}
                    initialEditValues={initialEditValues ?? createEmptyGalleryEditFormValues()}
                    onCancel={onClose}
                    onSubmitBulk={handleSubmitBulk}
                    onSubmitEdit={handleSubmitEdit}
                />
            ) : null}
        </DataTableDialog>
    );
}
