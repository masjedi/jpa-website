import { ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import {
    AFGHANISTAN_PROVINCE_ZONES,
    type ProvinceZone,
} from '@/components/sections/booking/bookingOptions';
import {
    bookingChoiceErrorClass,
    bookingErrorClass,
    bookingFieldClass,
    bookingLabelClass,
} from '@/components/sections/booking/bookingFields';
import { cn } from '@/lib/utils';

interface ProvinceZoneMultiSelectProps {
    value: readonly string[];
    onChange: (next: string[]) => void;
    zones?: readonly ProvinceZone[];
    disabled?: boolean;
    optional?: boolean;
    error?: string;
}

export function ProvinceZoneMultiSelect({
    value,
    onChange,
    zones = AFGHANISTAN_PROVINCE_ZONES,
    disabled = false,
    optional = false,
    error,
}: ProvinceZoneMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const selected = new Set(value);

    useEffect(() => {
        if (!open || disabled) {
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
    }, [disabled, open]);

    useEffect(() => {
        if (disabled) {
            setOpen(false);
        }
    }, [disabled]);

    const toggleProvince = (province: string) => {
        if (disabled) {
            return;
        }

        onChange(selected.has(province) ? value.filter((item) => item !== province) : [...value, province]);
    };

    const toggleZone = (provinces: readonly string[]) => {
        if (disabled) {
            return;
        }

        const allSelected = provinces.every((province) => selected.has(province));

        onChange(
            allSelected
                ? value.filter((item) => !provinces.includes(item))
                : [...new Set([...value, ...provinces])],
        );
    };

    const summary =
        value.length === 0
            ? 'Select provinces'
            : value.length === 1
              ? value[0]
              : `${value.length} provinces selected`;

    return (
        <div data-field="trip-destinations" ref={rootRef} className="relative">
            <label htmlFor="trip-destinations" className={bookingLabelClass}>
                Provinces
                {optional ? <span className="ms-1 font-normal text-muted-foreground">(optional)</span> : null}
                {!optional ? (
                    <span className="text-red-600 dark:text-red-400" aria-hidden>
                        {' '}
                        *
                    </span>
                ) : null}
            </label>
            <button
                id="trip-destinations"
                type="button"
                disabled={disabled}
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={menuId}
                aria-invalid={error ? true : undefined}
                onClick={() => setOpen((current) => !current)}
                className={cn(
                    bookingFieldClass,
                    'flex items-center justify-between gap-3 text-start',
                    error && bookingChoiceErrorClass,
                    disabled && 'cursor-not-allowed bg-surface-muted opacity-60',
                )}
            >
                <span className={cn(value.length === 0 && 'text-muted-foreground')}>{summary}</span>
                <ChevronDown
                    className={cn('size-4 shrink-0 text-secondary transition-transform', open && 'rotate-180')}
                    aria-hidden
                />
            </button>

            {open && !disabled ? (
                <div
                    id={menuId}
                    role="listbox"
                    aria-multiselectable="true"
                    onMouseDown={(event) => event.preventDefault()}
                    className="mt-2 max-h-[28rem] overflow-y-auto rounded-2xl border border-border bg-surface p-4 shadow-xl"
                >
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                        {zones.map((group) => {
                            const allSelected = group.provinces.every((province) => selected.has(province));
                            const someSelected = group.provinces.some((province) => selected.has(province));

                            return (
                                <section key={group.zone} className="min-w-0">
                                    <label
                                        className="flex cursor-pointer items-center gap-2"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            toggleZone(group.provinces);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            readOnly
                                            tabIndex={-1}
                                            ref={(element) => {
                                                if (element) {
                                                    element.indeterminate = someSelected && !allSelected;
                                                }
                                            }}
                                            className="size-4 shrink-0 rounded border-border text-secondary focus:outline-focus"
                                        />
                                        <span className="font-heading text-sm font-semibold text-foreground">
                                            {group.zone}
                                        </span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                        {group.provinces.map((province) => {
                                            const checked = selected.has(province);

                                            return (
                                                <label
                                                    key={province}
                                                    onMouseDown={(event) => {
                                                        event.preventDefault();
                                                        toggleProvince(province);
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
                                                    <span className="min-w-0 leading-snug">{province}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {value.length > 0 && !disabled ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {value.map((province) => (
                        <button
                            key={province}
                            type="button"
                            onClick={() => toggleProvince(province)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {province}
                            <X className="size-3" aria-hidden />
                            <span className="sr-only">Remove {province}</span>
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
