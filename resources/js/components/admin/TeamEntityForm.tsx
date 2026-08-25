import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import {
    createEmptyTeamFormValues,
    mapServerTeamFormErrors,
    type TeamFormErrors,
    type TeamFormSubmitPayload,
    type TeamFormValues,
    validateTeamFormValues,
} from '@/components/admin/teamForm';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { cn } from '@/lib/utils';
import type { TeamAvatarSpec } from '@/types/team';

interface TeamEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: TeamFormValues;
    onCancel: () => void;
    onSubmit: (payload: TeamFormSubmitPayload) => void | Promise<void>;
}

export function TeamEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: TeamEntityFormProps) {
    const { avatarSpec, errors: serverErrors } = usePage<{
        avatarSpec: TeamAvatarSpec;
        errors: Record<string, string | string[] | undefined>;
    }>().props;

    const nameFieldId = useId();
    const roleFieldId = useId();
    const bioFieldId = useId();
    const emailFieldId = useId();
    const whatsappFieldId = useId();
    const whatsappHrefFieldId = useId();
    const statusFieldId = useId();
    const imageFieldId = useId();

    const [values, setValues] = useState<TeamFormValues>(
        () => initialValues ?? createEmptyTeamFormValues(),
    );
    const [avatarImage, setAvatarImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        () => initialValues?.image || null,
    );
    const [errors, setErrors] = useState<TeamFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const mapped = mapServerTeamFormErrors(serverErrors);

        if (Object.keys(mapped).length > 0) {
            setErrors((current) => ({ ...current, ...mapped }));
        }
    }, [serverErrors]);

    const hasImage = Boolean(previewUrl);
    const uploadHint = avatarSpec?.hint ?? mediaProfiles.team_avatar.hint;

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create team member';

    const handleImageChange = (file: File | null, nextPreviewUrl: string | null) => {
        setAvatarImage(file);
        setPreviewUrl(nextPreviewUrl);
        setErrors((current) => ({ ...current, image: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateTeamFormValues(values, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: {
                    ...values,
                    name: values.name.trim(),
                    role: values.role.trim(),
                    bio: values.bio.trim(),
                    email: values.email.trim(),
                    whatsapp: values.whatsapp.trim(),
                    whatsappHref: values.whatsappHref.trim(),
                },
                avatarImage,
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
                <ImageUploadField
                    id={imageFieldId}
                    label="Portrait"
                    required={mode === 'create'}
                    disabled={submitting}
                    previewUrl={previewUrl}
                    onChange={handleImageChange}
                    error={errors.image}
                    hint={uploadHint}
                    previewAspectClass="aspect-[4/5]"
                    previewObjectFit="contain"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <AdminFormField id={nameFieldId} label="Name" required error={errors.name}>
                        <input
                            id={nameFieldId}
                            value={values.name}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({ ...current, name: event.target.value }));
                                setErrors((current) => ({ ...current, name: undefined }));
                            }}
                            placeholder="Wahid Rahimi"
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={adminFieldDescribedBy(nameFieldId, errors.name)}
                            className={cn(adminFieldClass, errors.name && adminFieldErrorClass)}
                        />
                    </AdminFormField>

                    <AdminFormField id={roleFieldId} label="Role" required error={errors.role}>
                        <input
                            id={roleFieldId}
                            value={values.role}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({ ...current, role: event.target.value }));
                                setErrors((current) => ({ ...current, role: undefined }));
                            }}
                            placeholder="Founder & lead guide"
                            aria-invalid={Boolean(errors.role)}
                            aria-describedby={adminFieldDescribedBy(roleFieldId, errors.role)}
                            className={cn(adminFieldClass, errors.role && adminFieldErrorClass)}
                        />
                    </AdminFormField>
                </div>

                <AdminFormField id={bioFieldId} label="Bio" required error={errors.bio}>
                    <textarea
                        id={bioFieldId}
                        value={values.bio}
                        disabled={submitting}
                        rows={5}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, bio: event.target.value }));
                            setErrors((current) => ({ ...current, bio: undefined }));
                        }}
                        placeholder="A short biography shown on the public team page."
                        aria-invalid={Boolean(errors.bio)}
                        aria-describedby={adminFieldDescribedBy(bioFieldId, errors.bio)}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.bio && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>

                <div className="grid gap-3 sm:grid-cols-2">
                    <AdminFormField id={emailFieldId} label="Email" required error={errors.email}>
                        <input
                            id={emailFieldId}
                            type="email"
                            value={values.email}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({ ...current, email: event.target.value }));
                                setErrors((current) => ({ ...current, email: undefined }));
                            }}
                            placeholder="name@journey-to-afghanistan.com"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={adminFieldDescribedBy(emailFieldId, errors.email)}
                            className={cn(adminFieldClass, errors.email && adminFieldErrorClass)}
                        />
                    </AdminFormField>

                    <AdminFormField
                        id={whatsappFieldId}
                        label="WhatsApp display"
                        required
                        error={errors.whatsapp}
                    >
                        <input
                            id={whatsappFieldId}
                            value={values.whatsapp}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    whatsapp: event.target.value,
                                }));
                                setErrors((current) => ({ ...current, whatsapp: undefined }));
                            }}
                            placeholder="+49 177 6687088"
                            aria-invalid={Boolean(errors.whatsapp)}
                            aria-describedby={adminFieldDescribedBy(
                                whatsappFieldId,
                                errors.whatsapp,
                            )}
                            className={cn(
                                adminFieldClass,
                                errors.whatsapp && adminFieldErrorClass,
                            )}
                        />
                    </AdminFormField>
                </div>

                <AdminFormField
                    id={whatsappHrefFieldId}
                    label="WhatsApp link"
                    required
                    error={errors.whatsappHref}
                >
                    <input
                        id={whatsappHrefFieldId}
                        value={values.whatsappHref}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                whatsappHref: event.target.value,
                            }));
                            setErrors((current) => ({ ...current, whatsappHref: undefined }));
                        }}
                        placeholder="https://wa.me/491776687088"
                        aria-invalid={Boolean(errors.whatsappHref)}
                        aria-describedby={adminFieldDescribedBy(
                            whatsappHrefFieldId,
                            errors.whatsappHref,
                        )}
                        className={cn(
                            adminFieldClass,
                            errors.whatsappHref && adminFieldErrorClass,
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
                                status: event.target.value as TeamFormValues['status'],
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
