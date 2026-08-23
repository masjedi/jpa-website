import { ImagePlus, X } from 'lucide-react';
import { type ChangeEvent, useId, useRef } from 'react';

import { adminFieldErrorTextClass } from '@/components/admin/adminForm';
import { cn } from '@/lib/utils';

export interface SelectedGalleryImage {
    file: File;
    previewUrl: string;
}

interface MultiImageUploadFieldProps {
    id?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    selectedImages: SelectedGalleryImage[];
    onChange: (images: SelectedGalleryImage[]) => void;
    error?: string;
    hint?: string;
    className?: string;
    maxFiles?: number;
}

export function MultiImageUploadField({
    id,
    label = 'Images',
    required = false,
    disabled = false,
    selectedImages,
    onChange,
    error,
    hint,
    className,
    maxFiles = 24,
}: MultiImageUploadFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        const remainingSlots = maxFiles - selectedImages.length;
        const nextFiles = files.slice(0, remainingSlots);
        const nextImages = nextFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        onChange([...selectedImages, ...nextImages]);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const nextImages = selectedImages.filter((_, imageIndex) => imageIndex !== index);
        onChange(nextImages);
    };

    const canAddMore = selectedImages.length < maxFiles;

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
                {selectedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
                        {selectedImages.map((image, index) => (
                            <div
                                key={`${image.file.name}-${image.file.lastModified}-${index}`}
                                className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted"
                            >
                                <img
                                    src={image.previewUrl}
                                    alt=""
                                    className="size-full object-cover"
                                />
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => removeImage(index)}
                                    className="absolute end-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-sm transition-colors hover:bg-surface-muted disabled:cursor-not-allowed"
                                    aria-label={`Remove ${image.file.name}`}
                                >
                                    <X className="size-3.5" aria-hidden />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => inputRef.current?.click()}
                        className="flex min-h-40 w-full flex-col items-center justify-center gap-2 px-4 py-8 text-muted-foreground transition-colors hover:bg-surface-muted/60 hover:text-foreground disabled:cursor-not-allowed"
                    >
                        <ImagePlus className="size-7" aria-hidden />
                        <span className="text-sm font-medium">Select images from device</span>
                        <span className="text-xs text-muted-foreground">
                            Choose one or more files (up to {maxFiles})
                        </span>
                    </button>
                )}

                {selectedImages.length > 0 ? (
                    <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
                        <p className="text-xs text-muted-foreground">
                            {selectedImages.length} image
                            {selectedImages.length === 1 ? '' : 's'} selected
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
                accept="image/*"
                multiple
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
