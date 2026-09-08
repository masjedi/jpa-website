import { usePage } from '@inertiajs/react';
import { type FormEvent, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyFaqFormValues,
    mapServerFaqFormErrors,
    type FaqFormErrors,
    type FaqFormValues,
    validateFaqFormValues,
} from '@/components/admin/faqForm';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { cn } from '@/lib/utils';

interface FaqEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: FaqFormValues;
    onCancel: () => void;
    onSubmit: (values: FaqFormValues) => void | Promise<void>;
}

const faqTranslatableFields = ['question', 'answer'] as const;

const emptyFaqFields = {
    question: '',
    answer: '',
};

export function FaqEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: FaqEntityFormProps) {
    const { errors: serverErrors } = usePage().props;
    const questionFieldId = useId();
    const answerFieldId = useId();
    const statusFieldId = useId();

    const startingValues = initialValues ?? createEmptyFaqFormValues();
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(faqTranslatableFields, {
                question: startingValues.question,
                answer: startingValues.answer,
            }),
        [startingValues.answer, startingValues.question],
    );

    const {
        activeLocale,
        switchLocale,
        draft,
        setField,
        commitAllLocales,
        completion,
        direction,
    } = useLocaleFormFields({
        initialByLocale,
        emptyFields: emptyFaqFields,
    });

    const [status, setStatus] = useState<FaqFormValues['status']>(startingValues.status);
    const [errors, setErrors] = useState<FaqFormErrors>(() =>
        mapServerFaqFormErrors(serverErrors as Record<string, string | string[] | undefined>),
    );
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

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(faqTranslatableFields, localeValues);
        const payloadValues: FaqFormValues = {
            question: translated.question,
            answer: translated.answer,
            status,
        };

        const nextErrors = validateFaqFormValues(payloadValues);
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
                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting}
                />

                <AdminFormField
                    id={questionFieldId}
                    label="Question"
                    required
                    error={errors.question}
                >
                    <input
                        id={questionFieldId}
                        value={draft.question}
                        dir={direction}
                        disabled={submitting}
                        onChange={(event) => {
                            setField('question', event.target.value);
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
                        value={draft.answer}
                        dir={direction}
                        disabled={submitting}
                        rows={5}
                        onChange={(event) => {
                            setField('answer', event.target.value);
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
                        value={status}
                        disabled={submitting}
                        onChange={(event) =>
                            setStatus(event.target.value as FaqFormValues['status'])
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
