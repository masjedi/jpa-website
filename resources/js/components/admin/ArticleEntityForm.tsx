import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useState } from 'react';

import {
    articleCategoryOptions,
    createEmptyArticleFormValues,
    mapServerArticleFormErrors,
    type ArticleFormErrors,
    type ArticleFormSubmitPayload,
    type ArticleFormValues,
    validateArticleFormValues,
} from '@/components/admin/articleForm';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { cn } from '@/lib/utils';

interface ArticleEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: ArticleFormValues;
    onCancel: () => void;
    onSubmit: (payload: ArticleFormSubmitPayload) => void | Promise<void>;
}

export function ArticleEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: ArticleEntityFormProps) {
    const categoryFieldId = useId();
    const statusFieldId = useId();
    const featuredFieldId = useId();
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
    const { errors: serverErrors } = usePage().props;

    useEffect(() => {
        const mapped = mapServerArticleFormErrors(serverErrors);

        if (Object.keys(mapped).length > 0) {
            setErrors((current) => ({ ...current, ...mapped }));
        }
    }, [serverErrors]);

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
            await onSubmit({
                values: {
                    ...values,
                    title: values.title.trim(),
                    summary: values.summary.trim(),
                    image: values.image.trim(),
                    content: values.content.trim(),
                },
                coverImage: imageFile,
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
            <div className="grid gap-5 p-5 xl:grid-cols-[17rem_minmax(0,1fr)] xl:items-start">
                <aside className="space-y-4 xl:sticky xl:top-0">
                    <ImageUploadField
                        id={imageFieldId}
                        required
                        disabled={submitting}
                        hint={mediaProfiles.blog_cover.hint}
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

                    <div className="space-y-3 rounded-xl border border-border/80 bg-surface-muted/20 p-3">
                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={values.status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        status: event.target.value as ArticleFormValues['status'],
                                    }))
                                }
                                className={adminFieldClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </AdminFormField>

                        <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                            <input
                                id={featuredFieldId}
                                type="checkbox"
                                checked={values.isFeatured}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        isFeatured: event.target.checked,
                                    }))
                                }
                                className="size-4 rounded border-border text-secondary focus:ring-focus"
                            />
                            Featured article
                        </label>
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
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
                            className="sm:col-span-2"
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
                    </div>

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
