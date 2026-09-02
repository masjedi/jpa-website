import { FilePlus, FileText, X } from 'lucide-react';
import { type ChangeEvent, useId, useRef } from 'react';

import { adminFieldErrorTextClass } from '@/components/admin/adminForm';
import { cn } from '@/lib/utils';

export interface SelectedUploadFile {
    file: File;
}

interface FileUploadFieldProps {
    id?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    files: SelectedUploadFile[];
    onChange: (files: SelectedUploadFile[]) => void;
    error?: string;
    hint?: string;
    className?: string;
    accept?: string;
    maxFiles?: number;
    multiple?: boolean;
    emptyLabel?: string;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadField({
    id,
    label = 'Files',
    required = false,
    disabled = false,
    files,
    onChange,
    error,
    hint,
    className,
    accept,
    maxFiles = 12,
    multiple = true,
    emptyLabel = 'Select files from device',
}: FileUploadFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);
    const limit = multiple ? maxFiles : 1;
    const canAddMore = files.length < limit;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFiles = Array.from(event.target.files ?? []);

        if (nextFiles.length === 0) {
            return;
        }

        const remainingSlots = limit - files.length;
        const accepted = nextFiles.slice(0, remainingSlots).map((file) => ({ file }));

        onChange(multiple ? [...files, ...accepted] : accepted);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        onChange(files.filter((_, fileIndex) => fileIndex !== index));
    };

    return (
        <div className={cn('space-y-1', className)}>
            <label htmlFor={inputId} className="text-xs font-medium text-foreground">
                {label}
                {required ? (
                    <>
                        <span className="text-red-600 dark:text-red-400" aria-hidden>
                            {' '}
                            *
                        </span>
                        <span className="sr-only"> (required)</span>
                    </>
                ) : null}
            </label>

            <div
                className={cn(
                    'overflow-hidden rounded-lg border border-border bg-surface',
                    error && 'border-red-500',
                    disabled && 'opacity-60',
                )}
            >
                {files.length > 0 ? (
                    <ul className="divide-y divide-border">
                        {files.map((item, index) => (
                            <li
                                key={`${item.file.name}-${item.file.lastModified}-${index}`}
                                className="flex items-center gap-3 px-3 py-2.5"
                            >
                                <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-foreground">{item.file.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {formatFileSize(item.file.size)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => removeFile(index)}
                                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed"
                                    aria-label={`Remove ${item.file.name}`}
                                >
                                    <X className="size-3.5" aria-hidden />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => inputRef.current?.click()}
                        className="flex min-h-28 w-full flex-col items-center justify-center gap-2 px-4 py-6 text-muted-foreground transition-colors hover:bg-surface-muted/60 hover:text-foreground disabled:cursor-not-allowed"
                    >
                        <FilePlus className="size-6" aria-hidden />
                        <span className="text-sm font-medium">{emptyLabel}</span>
                        <span className="text-xs text-muted-foreground">
                            {multiple ? `Choose one or more files (up to ${limit})` : 'Choose a file'}
                        </span>
                    </button>
                )}

                {files.length > 0 ? (
                    <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
                        <p className="text-xs text-muted-foreground">
                            {files.length} file{files.length === 1 ? '' : 's'} selected
                        </p>
                        {canAddMore ? (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => inputRef.current?.click()}
                                className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80 disabled:cursor-not-allowed"
                            >
                                Add more
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled || !canAddMore}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    [hint ? `${inputId}-hint` : null, error ? errorId : null]
                        .filter(Boolean)
                        .join(' ') || undefined
                }
                className="sr-only"
                onChange={handleFileChange}
            />

            {hint ? (
                <p id={`${inputId}-hint`} className="text-[11px] leading-relaxed text-muted-foreground">
                    {hint}
                </p>
            ) : null}

            {error ? (
                <p id={errorId} role="alert" className={adminFieldErrorTextClass}>
                    {error}
                </p>
            ) : null}
        </div>
    );
}
