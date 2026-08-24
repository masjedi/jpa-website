import { type FormEvent, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyFaqFormValues,
    type FaqFormErrors,
    type FaqFormValues,
    validateFaqFormValues,
} from '@/components/admin/faqForm';
import { cn } from '@/lib/utils';

interface FaqEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: FaqFormValues;
    onCancel: () => void;
    onSubmit: (values: FaqFormValues) => void | Promise<void>;
}

export function FaqEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: FaqEntityFormProps) {
    const questionFieldId = useId();
    const answerFieldId = useId();
    const statusFieldId = useId();

    const [values, setValues] = useState<FaqFormValues>(
        () => initialValues ?? createEmptyFaqFormValues(),
    );
    const [errors, setErrors] = useState<FaqFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create FAQ';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateFaqFormValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                question: values.question.trim(),
                answer: values.answer.trim(),
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
                <AdminFormField
                    id={questionFieldId}
                    label="Question"
                    required
                    error={errors.question}
                >
                    <input
                        id={questionFieldId}
                        value={values.question}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, question: event.target.value }));
                            setErrors((current) => ({ ...current, question: undefined }));
                        }}
                        placeholder="Do I need a visa to visit Afghanistan?"
                        aria-invalid={Boolean(errors.question)}
                        aria-describedby={adminFieldDescribedBy(questionFieldId, errors.question)}
                        className={cn(adminFieldClass, errors.question && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField
                    id={answerFieldId}
                    label="Answer"
                    required
                    error={errors.answer}
                >
                    <textarea
                        id={answerFieldId}
                        value={values.answer}
                        disabled={submitting}
                        rows={5}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, answer: event.target.value }));
                            setErrors((current) => ({ ...current, answer: undefined }));
                        }}
                        placeholder="Most nationalities require a visa in advance..."
                        aria-invalid={Boolean(errors.answer)}
                        aria-describedby={adminFieldDescribedBy(answerFieldId, errors.answer)}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.answer && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>

                <AdminFormField id={statusFieldId} label="Status">
                    <select
                        id={statusFieldId}
                        value={values.status}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                status: event.target.value as FaqFormValues['status'],
                            }))
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
