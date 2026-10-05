import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    articleCategoryOptions,
    createEmptyArticleFormValues,
    mapServerArticleFormErrors,
    type ArticleFormErrors,
    type ArticleFormSubmitPayload,
    type ArticleFormValues,
    type ArticleTeamMemberOption,
    validateArticleFormValues,
} from '@/components/admin/articleForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { cn } from '@/lib/utils';

interface ArticleEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    teamMembers: readonly ArticleTeamMemberOption[];
    initialValues?: ArticleFormValues;
    onCancel: () => void;
    onSubmit: (payload: ArticleFormSubmitPayload) => void | Promise<void>;
}

const articleTranslatableFields = ['title', 'summary', 'content'] as const;

const emptyArticleFields = {
    title: '',
    summary: '',
    content: '',
};

export function ArticleEntityForm({
    formId,
    mode,
    teamMembers,
    initialValues,
    onCancel,
    onSubmit,
}: ArticleEntityFormProps) {
    const categoryFieldId = useId();
    const statusFieldId = useId();
    const featuredFieldId = useId();
    const authorNameFieldId = useId();
    const authorRoleFieldId = useId();
    const authorFieldId = useId();
    const titleFieldId = useId();
    const summaryFieldId = useId();
    const contentFieldId = useId();
    const imageFieldId = useId();
    const { auth, errors: serverErrors } = usePage().props;

    const startingValues =
        initialValues ?? createEmptyArticleFormValues(teamMembers, auth.user?.name ?? '');
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(articleTranslatableFields, {
                title: startingValues.title,
                summary: startingValues.summary,
                content: startingValues.content,
            }),
        [startingValues.content, startingValues.summary, startingValues.title],
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
        emptyFields: emptyArticleFields,
    });

    const [category, setCategory] = useState(startingValues.category);
    const [teamMemberId, setTeamMemberId] = useState(startingValues.teamMemberId);
    const [authorName, setAuthorName] = useState(startingValues.authorName);
    const [authorRole, setAuthorRole] = useState(startingValues.authorRole);
    const [isFeatured, setIsFeatured] = useState(startingValues.isFeatured);
    const [status, setStatus] = useState(startingValues.status);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(startingValues.image || null);
    const [errors, setErrors] = useState<ArticleFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const mapped = mapServerArticleFormErrors(serverErrors);

        if (Object.keys(mapped).length > 0) {
            setErrors((current) => ({ ...current, ...mapped }));
        }
    }, [serverErrors]);

    const hasImage = Boolean(imageFile) || Boolean(startingValues.image.trim());
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

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(articleTranslatableFields, localeValues);
        const payloadValues: ArticleFormValues = {
            title: translated.title,
            summary: translated.summary,
            content: translated.content,
            category,
            image: startingValues.image,
            teamMemberId,
            authorName,
            authorRole,
            isFeatured,
            status,
        };

        const nextErrors = validateArticleFormValues(payloadValues, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: payloadValues,
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
                            setErrors((current) => ({ ...current, image: undefined }));
                        }}
                        error={errors.image}
                    />

                    <div className="space-y-3 rounded-xl border border-border/80 bg-surface-muted/20 p-3">
                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setStatus(event.target.value as ArticleFormValues['status'])
                                }
                                className={adminFieldClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </AdminFormField>

                        <AdminFormField
                            id={authorNameFieldId}
                            label="Author"
                            required
                            error={errors.authorName}
                        >
                            <input
                                id={authorNameFieldId}
                                value={authorName}
                                disabled={submitting}
                                onChange={(event) => {
                                    setAuthorName(event.target.value);
                                    setErrors((current) => ({ ...current, authorName: undefined }));
                                }}
                                placeholder="Author name"
                                aria-invalid={Boolean(errors.authorName)}
                                aria-describedby={adminFieldDescribedBy(
                                    authorNameFieldId,
                                    errors.authorName,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.authorName && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={authorRoleFieldId}
                            label="Author role"
                            error={errors.authorRole}
                        >
                            <input
                                id={authorRoleFieldId}
                                value={authorRole}
                                disabled={submitting}
                                onChange={(event) => {
                                    setAuthorRole(event.target.value);
                                    setErrors((current) => ({ ...current, authorRole: undefined }));
                                }}
                                placeholder="Guide, editor, or writer"
                                className={cn(
                                    adminFieldClass,
                                    errors.authorRole && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        {teamMembers.length > 0 ? (
                            <AdminFormField
                                id={authorFieldId}
                                label="Link team member"
                                error={errors.teamMemberId}
                            >
                                <select
                                    id={authorFieldId}
                                    value={teamMemberId}
                                    disabled={submitting}
                                    onChange={(event) => {
                                        const nextValue = event.target.value;
                                        const nextId = nextValue === '' ? '' : Number(nextValue);
                                        const selected = teamMembers.find((member) => member.id === nextId);

                                        setTeamMemberId(nextId);

                                        if (selected) {
                                            setAuthorName(selected.name);
                                            setAuthorRole(selected.role);
                                            setErrors((current) => ({
                                                ...current,
                                                authorName: undefined,
                                                teamMemberId: undefined,
                                            }));
                                        }
                                    }}
                                    aria-invalid={Boolean(errors.teamMemberId)}
                                    aria-describedby={adminFieldDescribedBy(
                                        authorFieldId,
                                        errors.teamMemberId,
                                    )}
                                    className={cn(
                                        adminFieldClass,
                                        errors.teamMemberId && adminFieldErrorClass,
                                    )}
                                >
                                    <option value="">None</option>
                                    {teamMembers.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name} · {member.role}
                                        </option>
                                    ))}
                                </select>
                            </AdminFormField>
                        ) : null}

                        <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                            <input
                                id={featuredFieldId}
                                type="checkbox"
                                checked={isFeatured}
                                disabled={submitting}
                                onChange={(event) => setIsFeatured(event.target.checked)}
                                className="size-4 rounded border-border text-secondary focus:ring-focus"
                            />
                            Featured article
                        </label>
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
                    <AdminLocaleSelector
                        activeLocale={activeLocale}
                        completion={completion}
                        onChange={switchLocale}
                        disabled={submitting}
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={categoryFieldId} label="Category" required>
                            <select
                                id={categoryFieldId}
                                value={category}
                                disabled={submitting}
                                onChange={(event) =>
                                    setCategory(event.target.value as ArticleFormValues['category'])
                                }
                                className={adminFieldClass}
                            >
                                {articleCategoryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
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
                                value={draft.title}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('title', event.target.value);
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
                                value={draft.summary}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('summary', event.target.value);
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
                        key={activeLocale}
                        id={contentFieldId}
                        label="Content"
                        required
                        disabled={submitting}
                        dir={direction}
                        value={draft.content}
                        onChange={(content) => {
                            setField('content', content);
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
