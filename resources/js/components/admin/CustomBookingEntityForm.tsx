import { type FormEvent, useState } from 'react';

import { FileUploadField, type SelectedUploadFile } from '@/components/admin/FileUploadField';

interface CustomBookingEntityFormProps {
    formId: string;
    travelerName: string;
    email: string;
    accept: string;
    hint: string;
    maxFiles: number;
    error?: string;
    onCancel: () => void;
    onSubmit: (files: File[]) => void | Promise<void>;
}

export function CustomBookingEntityForm({
    formId,
    travelerName,
    email,
    accept,
    hint,
    maxFiles,
    error,
    onCancel,
    onSubmit,
}: CustomBookingEntityFormProps) {
    const [files, setFiles] = useState<SelectedUploadFile[]>([]);
    const [filesError, setFilesError] = useState<string | undefined>();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (files.length === 0) {
            setFilesError('Select at least one file');
            return;
        }

        setFilesError(undefined);
        setSubmitting(true);

        try {
            await onSubmit(files.map((item) => item.file));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            aria-busy={submitting}
            className="flex min-h-0 flex-1 flex-col"
        >
            <div className="space-y-4 overflow-y-auto p-4">
                <div className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
                    <p className="text-sm font-medium text-foreground">{travelerName}</p>
                    {email ? <p className="text-xs text-muted-foreground">{email}</p> : null}
                </div>

                <FileUploadField
                    id={`${formId}-files`}
                    label="Customer files"
                    required
                    files={files}
                    onChange={(next) => {
                        setFiles(next);
                        setFilesError(undefined);
                    }}
                    disabled={submitting}
                    error={filesError ?? error}
                    hint={hint}
                    accept={accept}
                    maxFiles={maxFiles}
                    emptyLabel="Select files from device"
                />
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? 'Saving…' : 'Save files to this request'}
                </button>
            </footer>
        </form>
    );
}
