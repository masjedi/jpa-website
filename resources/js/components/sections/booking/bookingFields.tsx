import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { ChoiceOption } from '@/components/sections/booking/bookingOptions';

export const bookingLabelClass = 'block text-sm font-medium text-foreground';
export const bookingFieldClass =
    'mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60';
export const bookingFieldErrorClass =
    'border-red-500 focus:border-red-500 focus:outline-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:outline-red-400';
export const bookingChoiceErrorClass = 'border-red-500 dark:border-red-400';
export const bookingHelperClass = 'mt-1.5 text-xs leading-relaxed text-muted-foreground';
export const bookingErrorClass = 'mt-1.5 text-xs font-medium text-red-600 dark:text-red-400';
export const bookingErrorBannerClass =
    'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300';

interface FieldShellProps {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
}

export function BookingFieldShell({ id, label, error, hint, required, children }: FieldShellProps) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
        <div data-field={id}>
            <label htmlFor={id} className={bookingLabelClass}>
                {label}
                {required ? (
                    <span className="text-red-600 dark:text-red-400" aria-hidden>
                        {' '}
                        *
                    </span>
                ) : null}
            </label>
            {children}
            {hint && !error ? (
                <p id={hintId} className={bookingHelperClass}>
                    {hint}
                </p>
            ) : null}
            {error ? (
                <p id={errorId} className={bookingErrorClass} role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

interface TextFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'number';
    error?: string;
    hint?: string;
    required?: boolean;
    autoComplete?: string;
    min?: string | number;
    max?: string | number;
    maxLength?: number;
    minLength?: number;
    placeholder?: string;
    inputMode?: 'numeric' | 'tel' | 'email' | 'text';
    step?: number | 'any';
    spellCheck?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: 'on' | 'off';
}

export function BookingTextField({
    id,
    label,
    value,
    onChange,
    type = 'text',
    error,
    hint,
    required,
    autoComplete,
    min,
    max,
    maxLength,
    minLength,
    placeholder,
    inputMode,
    step,
    spellCheck,
    autoCapitalize,
    autoCorrect,
}: TextFieldProps) {
    const describedBy = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <BookingFieldShell id={id} label={label} error={error} hint={hint} required={required}>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                autoComplete={autoComplete}
                min={min}
                max={max}
                maxLength={maxLength}
                minLength={minLength}
                placeholder={placeholder}
                inputMode={inputMode}
                step={step}
                spellCheck={spellCheck}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cn(bookingFieldClass, error && bookingFieldErrorClass)}
            />
        </BookingFieldShell>
    );
}

interface TextareaFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    required?: boolean;
    rows?: number;
    maxLength?: number;
}

export function BookingTextareaField({
    id,
    label,
    value,
    onChange,
    error,
    hint,
    required,
    rows = 4,
    maxLength,
}: TextareaFieldProps) {
    const describedBy = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <BookingFieldShell id={id} label={label} error={error} hint={hint} required={required}>
            <textarea
                id={id}
                name={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={rows}
                maxLength={maxLength}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cn(bookingFieldClass, 'resize-y', error && bookingFieldErrorClass)}
            />
        </BookingFieldShell>
    );
}

interface BookingRadioGroupProps<T extends string> {
    legend: string;
    name: string;
    options: readonly ChoiceOption<T>[];
    value: T | '';
    onChange: (value: T) => void;
    error?: string;
}

export function BookingRadioGroup<T extends string>({
    legend,
    name,
    options,
    value,
    onChange,
    error,
}: BookingRadioGroupProps<T>) {
    const errorId = error ? `${name}-error` : undefined;

    return (
        <fieldset data-field={name} aria-describedby={errorId} aria-invalid={error ? true : undefined}>
            <legend className={bookingLabelClass}>{legend}</legend>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options.map((option) => {
                    const id = `${name}-${option.value}`;
                    const isSelected = value === option.value;

                    return (
                        <label
                            key={option.value}
                            htmlFor={id}
                            className={cn(
                                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
                                isSelected
                                    ? 'border-secondary bg-secondary/10 text-foreground'
                                    : error
                                      ? `bg-background text-foreground hover:border-red-400 ${bookingChoiceErrorClass}`
                                      : 'border-border bg-background text-foreground hover:border-secondary/40',
                            )}
                        >
                            <input
                                id={id}
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={() => onChange(option.value)}
                                className="size-4 border-border text-secondary focus:ring-focus"
                            />
                            {option.label}
                        </label>
                    );
                })}
            </div>
            {error ? (
                <p id={errorId} className={bookingErrorClass} role="alert">
                    {error}
                </p>
            ) : null}
        </fieldset>
    );
}

interface OptionCardsProps<T extends string> {
    legend: string;
    name: string;
    options: readonly ChoiceOption<T>[];
    value: T | '' | readonly T[];
    onChange: (value: T) => void;
    error?: string;
    hint?: string;
    multiple?: boolean;
    columns?: 1 | 2 | 3;
}

export function OptionCards<T extends string>({
    legend,
    name,
    options,
    value,
    onChange,
    error,
    hint,
    multiple = false,
    columns = 2,
}: OptionCardsProps<T>) {
    const selected = Array.isArray(value) ? value : value === '' ? [] : [value];
    const hintId = hint ? `${name}-hint` : undefined;
    const errorId = error ? `${name}-error` : undefined;

    return (
        <fieldset
            data-field={name}
            aria-invalid={error ? true : undefined}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        >
            <legend className={bookingLabelClass}>{legend}</legend>
            {hint && !error ? (
                <p id={hintId} className={bookingHelperClass}>
                    {hint}
                </p>
            ) : null}
            <div
                className={cn(
                    'mt-2.5 grid gap-2',
                    columns === 1 && 'grid-cols-1',
                    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                )}
                aria-multiselectable={multiple || undefined}
            >
                {options.map((option) => {
                    const isSelected = selected.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                'rounded-xl border px-4 py-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                isSelected
                                    ? 'border-secondary bg-secondary/10 text-foreground'
                                    : error
                                      ? `bg-background text-foreground hover:border-red-400 ${bookingChoiceErrorClass}`
                                      : 'border-border bg-background text-foreground hover:border-secondary/40',
                            )}
                        >
                            <span className="block text-sm font-medium">{option.label}</span>
                            {option.description ? (
                                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                    {option.description}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
            {error ? (
                <p id={errorId} className={bookingErrorClass} role="alert">
                    {error}
                </p>
            ) : null}
        </fieldset>
    );
}

interface CheckboxCardProps {
    checked: boolean;
    onChange: () => void;
    label: string;
    description?: string;
    emphasized?: boolean;
    invalid?: boolean;
}

export function CheckboxCard({
    checked,
    onChange,
    label,
    description,
    emphasized,
    invalid,
}: CheckboxCardProps) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={onChange}
            className={cn(
                'rounded-xl border px-4 py-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                checked
                    ? 'border-secondary bg-secondary/10 text-foreground'
                    : invalid
                      ? `bg-background text-foreground hover:border-red-400 ${bookingChoiceErrorClass}`
                      : 'border-border bg-background text-foreground hover:border-secondary/40',
                emphasized && 'sm:col-span-2',
            )}
        >
            <span className="block text-sm font-medium">{label}</span>
            {description ? (
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
            ) : null}
        </button>
    );
}

interface ConsentCheckboxProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    required?: boolean;
    children: ReactNode;
}

export function ConsentCheckbox({ id, checked, onChange, error, required, children }: ConsentCheckboxProps) {
    return (
        <div data-field={id}>
            <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    required={required}
                    aria-required={required || undefined}
                    aria-invalid={error ? true : undefined}
                    className={cn(
                        'mt-0.5 size-4 shrink-0 rounded border-border text-secondary focus:outline-focus',
                        error && 'border-red-500 dark:border-red-400',
                    )}
                />
                <span>{children}</span>
            </label>
            {error ? (
                <p className={cn(bookingErrorClass, 'ms-7')} role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function StepSection({
    title,
    description,
    children,
}: {
    title?: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-4">
            {title ? (
                <div>
                    <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
                    {description ? (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                    ) : null}
                </div>
            ) : null}
            {children}
        </section>
    );
}

export function BookingStepErrorBanner({ count }: { count: number }) {
    if (count < 1) {
        return null;
    }

    return (
        <div role="alert" className={cn('mt-6', bookingErrorBannerClass)}>
            <p className="font-medium">Please correct the highlighted fields before continuing.</p>
            <p className="mt-1 text-xs">
                {count === 1 ? '1 field needs attention.' : `${count} fields need attention.`}
            </p>
        </div>
    );
}
