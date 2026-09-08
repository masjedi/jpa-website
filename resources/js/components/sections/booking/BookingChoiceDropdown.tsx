import { ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import type { ChoiceOption } from '@/components/sections/booking/bookingOptions';
import {
    bookingChoiceErrorClass,
    bookingErrorClass,
    bookingFieldClass,
    bookingLabelClass,
} from '@/components/sections/booking/bookingFields';
import { cn } from '@/lib/utils';

interface BookingChoiceDropdownProps<T extends string> {
    id: string;
    label: string;
    options: readonly ChoiceOption<T>[];
    values: readonly T[];
    onChange: (next: T[]) => void;
    multiple?: boolean;
    required?: boolean;
    hideLabel?: boolean;
    error?: string;
    placeholder?: string;
}

export function BookingChoiceDropdown<T extends string>({
    id,
    label,
    options,
    values,
    onChange,
    multiple = false,
    required = false,
    hideLabel = false,
    error,
    placeholder = 'Select an option',
}: BookingChoiceDropdownProps<T>) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const selected = new Set(values);
    const labelByValue = new Map(options.map((option) => [option.value, option.label]));

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const toggle = (value: T) => {
        if (multiple) {
            onChange(selected.has(value) ? values.filter((item) => item !== value) : [...values, value]);
            return;
        }

        onChange([value]);
        setOpen(false);
    };

    const summary =
        values.length === 0
            ? placeholder
            : multiple
              ? values.length === 1
                  ? (labelByValue.get(values[0]) ?? values[0])
                  : `${values.length} selected`
              : (labelByValue.get(values[0]) ?? values[0]);

    return (
        <div data-field={id} ref={rootRef} className="relative">
            <label htmlFor={id} className={cn(bookingLabelClass, hideLabel && 'sr-only')}>
                {label}
                {required ? (
                    <span className="text-red-600 dark:text-red-400" aria-hidden>
                        {' '}
                        *
                    </span>
                ) : null}
            </label>
            <button
                id={id}
                type="button"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={menuId}
                aria-invalid={error ? true : undefined}
                onClick={() => setOpen((current) => !current)}
                className={cn(
                    bookingFieldClass,
                    'flex items-center justify-between gap-3 text-start',
                    error && bookingChoiceErrorClass,
                )}
            >
                <span className={cn(values.length === 0 && 'text-muted-foreground')}>{summary}</span>
                <ChevronDown
                    className={cn('size-4 shrink-0 text-secondary transition-transform', open && 'rotate-180')}
                    aria-hidden
                />
            </button>

            {open ? (
                <div
                    id={menuId}
                    role="listbox"
                    aria-multiselectable={multiple || undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-surface p-3 shadow-xl"
                >
                    <div
                        className={cn(
                            'grid gap-1.5',
                            multiple && options.length > 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
                        )}
                    >
                        {options.map((option) => {
                            const checked = selected.has(option.value);

                            if (multiple) {
                                return (
                                    <label
                                        key={option.value}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            toggle(option.value);
                                        }}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-muted',
                                            checked && 'bg-secondary/10 text-foreground',
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            readOnly
                                            tabIndex={-1}
                                            className="size-4 shrink-0 rounded border-border text-secondary focus:outline-focus"
                                        />
                                        <span className="min-w-0 leading-snug">{option.label}</span>
                                    </label>
                                );
                            }

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={checked}
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        toggle(option.value);
                                    }}
                                    className={cn(
                                        'rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                        checked && 'bg-secondary/10 text-foreground',
                                    )}
                                >
                                    <span className="font-medium">{option.label}</span>
                                    {option.description ? (
                                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                            {option.description}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {multiple && values.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {values.map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => toggle(value)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {labelByValue.get(value) ?? value}
                            <X className="size-3" aria-hidden />
                            <span className="sr-only">Remove {labelByValue.get(value) ?? value}</span>
                        </button>
                    ))}
                </div>
            ) : null}

            {error ? (
                <p className={bookingErrorClass} role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
