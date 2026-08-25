import { type FormEvent, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyTestimonialFormValues,
    type TestimonialFormErrors,
    type TestimonialFormValues,
    validateTestimonialFormValues,
} from '@/components/admin/testimonialForm';
import { cn } from '@/lib/utils';

interface TestimonialEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: TestimonialFormValues;
    onCancel: () => void;
    onSubmit: (values: TestimonialFormValues) => void | Promise<void>;
}

export function TestimonialEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: TestimonialEntityFormProps) {
    const nameFieldId = useId();
    const journeyFieldId = useId();
    const textFieldId = useId();
    const ratingFieldId = useId();
    const statusFieldId = useId();

    const [values, setValues] = useState<TestimonialFormValues>(
        () => initialValues ?? createEmptyTestimonialFormValues(),
    );
    const [errors, setErrors] = useState<TestimonialFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create testimonial';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateTestimonialFormValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                name: values.name.trim(),
                journey: values.journey.trim(),
                text: values.text.trim(),
                rating: values.rating,
                status: values.status,
            });
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
                <AdminFormField id={nameFieldId} label="Traveller name" required error={errors.name}>
                    <input
                        id={nameFieldId}
                        value={values.name}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, name: event.target.value }));
                            setErrors((current) => ({ ...current, name: undefined }));
                        }}
                        placeholder="Elena M."
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={adminFieldDescribedBy(nameFieldId, errors.name)}
                        className={cn(adminFieldClass, errors.name && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField
                    id={journeyFieldId}
                    label="Journey"
                    required
                    error={errors.journey}
                >
                    <input
                        id={journeyFieldId}
                        value={values.journey}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, journey: event.target.value }));
                            setErrors((current) => ({ ...current, journey: undefined }));
                        }}
                        placeholder="Bamiyan Heritage Circuit, 2025"
                        aria-invalid={Boolean(errors.journey)}
                        aria-describedby={adminFieldDescribedBy(journeyFieldId, errors.journey)}
                        className={cn(adminFieldClass, errors.journey && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={textFieldId} label="Quote" required error={errors.text}>
                    <textarea
                        id={textFieldId}
                        value={values.text}
                        disabled={submitting}
                        rows={5}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, text: event.target.value }));
                            setErrors((current) => ({ ...current, text: undefined }));
                        }}
                        placeholder="The guide's knowledge turned every site into a story..."
                        aria-invalid={Boolean(errors.text)}
                        aria-describedby={adminFieldDescribedBy(textFieldId, errors.text)}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.text && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>

                <div className="grid gap-3 sm:grid-cols-2">
                    <AdminFormField
                        id={ratingFieldId}
                        label="Star rating"
                        required
                        error={errors.rating}
                    >
                        <select
                            id={ratingFieldId}
                            value={values.rating}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    rating: Number(event.target.value),
                                }));
                                setErrors((current) => ({ ...current, rating: undefined }));
                            }}
                            aria-invalid={Boolean(errors.rating)}
                            aria-describedby={adminFieldDescribedBy(ratingFieldId, errors.rating)}
                            className={cn(adminFieldClass, errors.rating && adminFieldErrorClass)}
                        >
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>
                                    {rating} star{rating === 1 ? '' : 's'}
                                </option>
                            ))}
                        </select>
                    </AdminFormField>

                    <AdminFormField id={statusFieldId} label="Status">
                        <select
                            id={statusFieldId}
                            value={values.status}
                            disabled={submitting}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    status: event.target.value as TestimonialFormValues['status'],
                                }))
                            }
                            className={adminFieldClass}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </AdminFormField>
                </div>
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
