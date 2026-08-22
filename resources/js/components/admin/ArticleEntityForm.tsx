import { type FormEvent, useId, useState } from 'react';

import {
    articleCategoryOptions,
    createEmptyArticleFormValues,
    type ArticleFormErrors,
    type ArticleFormValues,
    validateArticleFormValues,
} from '@/components/admin/articleForm';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { ImageUploadField, readImageFileAsDataUrl } from '@/components/admin/ImageUploadField';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
import { cn } from '@/lib/utils';

interface ArticleEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: ArticleFormValues;
    onCancel: () => void;
    onSubmit: (values: ArticleFormValues) => void | Promise<void>;
}

export function ArticleEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: ArticleEntityFormProps) {
    const categoryFieldId = useId();
    const titleFieldId = useId();
    const summaryFieldId = useId();
    const imageFieldId = useId();
    const contentFieldId = useId();

    const [values, setValues] = useState<ArticleFormValues>(
        () => initialValues ?? createEmptyArticleFormValues(),
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        () => initialValues?.image || null,
    );
    const [errors, setErrors] = useState<ArticleFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const hasImage = Boolean(imageFile) || Boolean(values.image.trim());
    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create article';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateArticleFormValues(values, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const image = imageFile ? await readImageFileAsDataUrl(imageFile) : values.image.trim();

            await onSubmit({
                title: values.title.trim(),
                summary: values.summary.trim(),
                category: values.category,
                image,
                content: values.content.trim(),
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
            <div className="grid gap-3 p-4 lg:grid-cols-3">
                <AdminFormField id={categoryFieldId} label="Category" required>
                    <select
                        id={categoryFieldId}
                        value={values.category}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                category: event.target.value as ArticleFormValues['category'],
                            }))
                        }
                        className={adminFieldClass}
                    >
                        {articleCategoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </AdminFormField>

                <AdminFormField
                    id={titleFieldId}
                    label="Title"
                    required
                    error={errors.title}
                >
                    <input
                        id={titleFieldId}
                        value={values.title}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, title: event.target.value }));
                            setErrors((current) => ({ ...current, title: undefined }));
                        }}
                        placeholder="What to pack for spring in Afghanistan"
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby={adminFieldDescribedBy(titleFieldId, errors.title)}
                        className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField
                    id={summaryFieldId}
                    label="Summary"
                    required
                    error={errors.summary}
                >
                    <input
                        id={summaryFieldId}
                        value={values.summary}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, summary: event.target.value }));
                            setErrors((current) => ({ ...current, summary: undefined }));
                        }}
                        placeholder="Layering, footwear and small essentials for variable mountain weather."
                        aria-invalid={Boolean(errors.summary)}
                        aria-describedby={adminFieldDescribedBy(summaryFieldId, errors.summary)}
                        className={cn(adminFieldClass, errors.summary && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <ImageUploadField
                    id={imageFieldId}
                    className="lg:col-span-1"
                    required
                    disabled={submitting}
                    previewUrl={imagePreview}
                    onChange={(file, preview) => {
                        setImageFile(file);
                        setImagePreview(preview);
                        setValues((current) => ({
                            ...current,
                            image: preview ? current.image : '',
                        }));
                        setErrors((current) => ({ ...current, image: undefined }));
                    }}
                    error={errors.image}
                />

                <div className="lg:col-span-2">
                    <LazyRichTextEditor
                        id={contentFieldId}
                        label="Content"
                        required
                        disabled={submitting}
                        value={values.content}
                        onChange={(content) => {
                            setValues((current) => ({ ...current, content }));
                            setErrors((current) => ({ ...current, content: undefined }));
                        }}
                        placeholder="Write the article body, headings, lists, and practical notes for the detail page."
                        error={errors.content}
                    />
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
