import { type FormEvent, useId, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyFilterPlacementFormValues,
    type FilterPlacementFormErrors,
    type FilterPlacementFormValues,
    validateFilterPlacementFormValues,
} from '@/components/admin/filterPlacementForm';
import { useLocaleFormField } from '@/hooks/use-locale-form-fields';
import { normalizeTranslatedString } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { tourFilterOptionPlaceholders, tourFilterOptionTypeLabels } from '@/types/tourFilterOptions';

interface FilterPlacementEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: FilterPlacementFormValues;
    onCancel: () => void;
    onSubmit: (values: FilterPlacementFormValues) => void | Promise<void>;
}

export function FilterPlacementEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: FilterPlacementEntityFormProps) {
    const nameFieldId = useId();
    const valueFieldId = useId();
    const statusFieldId = useId();

    const startingValues = initialValues ?? createEmptyFilterPlacementFormValues('region');
    const normalizedName = normalizeTranslatedString(startingValues.name);

    const {
        activeLocale,
        switchLocale,
        draft,
        setDraft,
        commitAllLocales,
        completion,
        direction,
    } = useLocaleFormField(normalizedName);

    const [type, setType] = useState(startingValues.type);
    const [value, setValue] = useState(startingValues.value);
    const [status, setStatus] = useState(startingValues.status);
    const [errors, setErrors] = useState<FilterPlacementFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const typeLabel = tourFilterOptionTypeLabels[type].toLowerCase();
    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : `Create ${typeLabel}`;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nameValues = commitAllLocales();
        const payloadValues: FilterPlacementFormValues = {
            type,
            name: nameValues,
            value,
            status,
        };

        const nextErrors = validateFilterPlacementFormValues(payloadValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit(payloadValues);
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
            <div className="grid gap-3 p-4">
                {mode === 'edit' && value ? (
                    <AdminFormField id={valueFieldId} label="Stable key">
                        <input
                            id={valueFieldId}
                            value={value}
                            readOnly
                            disabled
                            className={cn(adminFieldClass, 'bg-surface-muted text-muted-foreground')}
                        />
                    </AdminFormField>
                ) : null}

                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting}
                />

                <AdminFormField
                    id={nameFieldId}
                    label="Name"
                    required
                    error={errors.name}
                >
                    <input
                        id={nameFieldId}
                        value={draft}
                        dir={direction}
                        disabled={submitting}
                        onChange={(event) => {
                            setDraft(event.target.value);
                            setErrors((current) => ({ ...current, name: undefined }));
                        }}
                        placeholder={tourFilterOptionPlaceholders[type]}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={adminFieldDescribedBy(nameFieldId, errors.name)}
                        className={cn(adminFieldClass, errors.name && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={statusFieldId} label="Status">
                    <select
                        id={statusFieldId}
                        value={status}
                        disabled={submitting}
                        onChange={(event) =>
                            setStatus(event.target.value as FilterPlacementFormValues['status'])
                        }
                        className={adminFieldClass}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </AdminFormField>
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
                    {submitLabel}
                </button>
            </footer>
        </form>
    );
}
