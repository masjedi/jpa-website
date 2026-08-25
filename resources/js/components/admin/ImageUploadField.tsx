import { ImagePlus, X } from 'lucide-react';
import { type ChangeEvent, useId, useRef } from 'react';

import { adminFieldErrorTextClass } from '@/components/admin/adminForm';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
    id?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    previewUrl: string | null;
    onChange: (file: File | null, previewUrl: string | null) => void;
    error?: string;
    hint?: string;
    className?: string;
    previewAspectClass?: string;
    previewObjectFit?: 'cover' | 'contain';
}

export function ImageUploadField({
    id,
    label = 'Image',
    required = false,
    disabled = false,
    previewUrl,
    onChange,
    error,
    hint,
    className,
    previewAspectClass = 'aspect-[4/3]',
    previewObjectFit = 'cover',
}: ImageUploadFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            onChange(null, null);
            return;
        }

        onChange(file, URL.createObjectURL(file));
    };

    const clearImage = () => {
        onChange(null, null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
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
                <div className={cn('relative bg-surface-muted', previewAspectClass)}>
                    {previewUrl ? (
                        <>
                            <img
                                src={previewUrl}
                                alt=""
                                className={cn(
                                    'size-full',
                                    previewObjectFit === 'contain'
                                        ? 'object-contain object-center'
                                        : 'object-cover',
                                )}
                            />
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={clearImage}
                                className="absolute end-2 top-2 inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-sm transition-colors hover:bg-surface-muted disabled:cursor-not-allowed"
                                aria-label="Remove image"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => inputRef.current?.click()}
                            className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:bg-surface-muted/60 hover:text-foreground disabled:cursor-not-allowed"
                        >
                            <ImagePlus className="size-6" aria-hidden />
                            <span className="text-xs font-medium">Upload from device</span>
                        </button>
                    )}
                </div>

                {previewUrl ? (
                    <div className="border-t border-border p-2">
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => inputRef.current?.click()}
                            className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80 disabled:cursor-not-allowed"
                        >
                            Replace image
                        </button>
                    </div>
                ) : null}
            </div>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept="image/*"
                disabled={disabled}
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

export function readImageFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}
