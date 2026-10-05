import { type FormEvent, useId, useMemo, useState } from 'react';

import {
    aboutContentToFormValues,
    aboutContentTranslatableFields,
    validateAboutContentFormValues,
    type AboutContentFormErrors,
    type AboutContentFormValues,
} from '@/components/admin/aboutPageForm';
import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass } from '@/components/admin/adminForm';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import type { AdminAboutPageContent } from '@/types/aboutPage';

interface AboutContentEditorProps {
    formId: string;
    content: AdminAboutPageContent;
    onCancel: () => void;
    onSave: (values: AboutContentFormValues) => void | Promise<void>;
}

const aboutContentEmptyFields = {
    introEyebrow: '',
    introTitle: '',
    introDescription: '',
    missionSectionEyebrow: '',
    missionSectionTitle: '',
    missionTitle: '',
    missionDescription: '',
    visionTitle: '',
    visionDescription: '',
    ctaEyebrow: '',
    ctaTitle: '',
    ctaDescription: '',
    ctaPrimaryLabel: '',
    ctaSecondaryLabel: '',
};

export function AboutContentEditor({
    formId,
    content,
    onCancel,
    onSave,
}: AboutContentEditorProps) {
    const introEyebrowId = useId();
    const introTitleId = useId();
    const introDescriptionId = useId();
    const missionSectionEyebrowId = useId();
    const missionSectionTitleId = useId();
    const missionTitleId = useId();
    const visionTitleId = useId();
    const missionDescriptionId = useId();
    const visionDescriptionId = useId();
    const ctaEyebrowId = useId();
    const ctaTitleId = useId();
    const ctaDescriptionId = useId();
    const ctaPrimaryLabelId = useId();
    const ctaPrimaryHrefId = useId();
    const ctaSecondaryLabelId = useId();
    const ctaSecondaryHrefId = useId();

    const startingValues = aboutContentToFormValues(content);
    const initialByLocale = useMemo(
        () => buildInitialLocaleMap(aboutContentTranslatableFields, startingValues),
        [startingValues],
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
        emptyFields: aboutContentEmptyFields,
    });

    const [ctaPrimaryHref, setCtaPrimaryHref] = useState(startingValues.ctaPrimaryHref);
    const [ctaSecondaryHref, setCtaSecondaryHref] = useState(startingValues.ctaSecondaryHref);
    const [errors, setErrors] = useState<AboutContentFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(aboutContentTranslatableFields, localeValues);
        const payloadValues: AboutContentFormValues = {
            ...translated,
            ctaPrimaryHref,
            ctaSecondaryHref,
        };

        const nextErrors = validateAboutContentFormValues(payloadValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSave(payloadValues);
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
            <div className="space-y-2 p-4">
                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting}
                />

                <AdminCollapsibleSection
                    title="Journey intro"
                    description="Eyebrow, title, and lead paragraph above the timeline."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={introEyebrowId} label="Eyebrow">
                            <input
                                id={introEyebrowId}
                                value={draft.introEyebrow}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('introEyebrow', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={introTitleId} label="Title" error={errors.introTitle}>
                            <input
                                id={introTitleId}
                                value={draft.introTitle}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('introTitle', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={introDescriptionId}
                            label="Description"
                            className="sm:col-span-2"
                            error={errors.introDescription}
                        >
                            <textarea
                                id={introDescriptionId}
                                value={draft.introDescription}
                                dir={direction}
                                disabled={submitting}
                                rows={4}
                                onChange={(event) =>
                                    setField('introDescription', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Mission section"
                    description="Section heading above mission and vision blocks."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={missionSectionEyebrowId} label="Eyebrow">
                            <input
                                id={missionSectionEyebrowId}
                                value={draft.missionSectionEyebrow}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) =>
                                    setField('missionSectionEyebrow', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={missionSectionTitleId}
                            label="Title"
                            error={errors.missionSectionTitle}
                        >
                            <input
                                id={missionSectionTitleId}
                                value={draft.missionSectionTitle}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) =>
                                    setField('missionSectionTitle', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection title="Mission & vision">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={missionTitleId} label="Mission title" error={errors.missionTitle}>
                            <input
                                id={missionTitleId}
                                value={draft.missionTitle}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('missionTitle', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={visionTitleId} label="Vision title" error={errors.visionTitle}>
                            <input
                                id={visionTitleId}
                                value={draft.visionTitle}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('visionTitle', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={missionDescriptionId}
                            label="Mission description"
                            className="sm:col-span-2"
                            error={errors.missionDescription}
                        >
                            <textarea
                                id={missionDescriptionId}
                                value={draft.missionDescription}
                                dir={direction}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) =>
                                    setField('missionDescription', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={visionDescriptionId}
                            label="Vision description"
                            className="sm:col-span-2"
                            error={errors.visionDescription}
                        >
                            <textarea
                                id={visionDescriptionId}
                                value={draft.visionDescription}
                                dir={direction}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) =>
                                    setField('visionDescription', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection title="Call to action">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={ctaEyebrowId} label="Eyebrow">
                            <input
                                id={ctaEyebrowId}
                                value={draft.ctaEyebrow}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('ctaEyebrow', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaTitleId} label="Title" error={errors.ctaTitle}>
                            <input
                                id={ctaTitleId}
                                value={draft.ctaTitle}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('ctaTitle', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={ctaDescriptionId}
                            label="Description"
                            className="sm:col-span-2"
                            error={errors.ctaDescription}
                        >
                            <textarea
                                id={ctaDescriptionId}
                                value={draft.ctaDescription}
                                dir={direction}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) => setField('ctaDescription', event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={ctaPrimaryLabelId}
                            label="Primary label"
                            error={errors.ctaPrimaryLabel}
                        >
                            <input
                                id={ctaPrimaryLabelId}
                                value={draft.ctaPrimaryLabel}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) =>
                                    setField('ctaPrimaryLabel', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaPrimaryHrefId} label="Primary link">
                            <input
                                id={ctaPrimaryHrefId}
                                value={ctaPrimaryHref}
                                disabled={submitting}
                                onChange={(event) => setCtaPrimaryHref(event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={ctaSecondaryLabelId}
                            label="Secondary label"
                            error={errors.ctaSecondaryLabel}
                        >
                            <input
                                id={ctaSecondaryLabelId}
                                value={draft.ctaSecondaryLabel}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) =>
                                    setField('ctaSecondaryLabel', event.target.value)
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaSecondaryHrefId} label="Secondary link">
                            <input
                                id={ctaSecondaryHrefId}
                                value={ctaSecondaryHref}
                                disabled={submitting}
                                onChange={(event) => setCtaSecondaryHref(event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>
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
                    {submitting ? 'Saving…' : 'Save content'}
                </button>
            </footer>
        </form>
    );
}
