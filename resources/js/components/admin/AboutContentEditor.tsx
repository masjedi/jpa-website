import { type FormEvent, useId, useState } from 'react';

import {
    aboutContentToFormValues,
    type AboutContentFormValues,
} from '@/components/admin/aboutPageForm';
import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass } from '@/components/admin/adminForm';
import type { AboutPageContent } from '@/types/aboutPage';

interface AboutContentEditorProps {
    formId: string;
    content: AboutPageContent;
    onCancel: () => void;
    onSave: (values: AboutContentFormValues) => void | Promise<void>;
}

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

    const [values, setValues] = useState<AboutContentFormValues>(() =>
        aboutContentToFormValues(content),
    );
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await onSave(values);
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
                <AdminCollapsibleSection
                    title="Journey intro"
                    description="Eyebrow, title, and lead paragraph above the timeline."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={introEyebrowId} label="Eyebrow">
                            <input
                                id={introEyebrowId}
                                value={values.introEyebrow}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        introEyebrow: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={introTitleId} label="Title">
                            <input
                                id={introTitleId}
                                value={values.introTitle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        introTitle: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={introDescriptionId}
                            label="Description"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={introDescriptionId}
                                value={values.introDescription}
                                disabled={submitting}
                                rows={2}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        introDescription: event.target.value,
                                    }))
                                }
                                className={`${adminFieldClass} resize-y`}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Mission & vision"
                    description="Section heading plus mission and vision cards."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={missionSectionEyebrowId} label="Section eyebrow">
                            <input
                                id={missionSectionEyebrowId}
                                value={values.missionSectionEyebrow}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        missionSectionEyebrow: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={missionSectionTitleId} label="Section title">
                            <input
                                id={missionSectionTitleId}
                                value={values.missionSectionTitle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        missionSectionTitle: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={missionTitleId} label="Mission title">
                            <input
                                id={missionTitleId}
                                value={values.missionTitle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        missionTitle: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={visionTitleId} label="Vision title">
                            <input
                                id={visionTitleId}
                                value={values.visionTitle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        visionTitle: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={missionDescriptionId}
                            label="Mission description"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={missionDescriptionId}
                                value={values.missionDescription}
                                disabled={submitting}
                                rows={2}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        missionDescription: event.target.value,
                                    }))
                                }
                                className={`${adminFieldClass} resize-y`}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={visionDescriptionId}
                            label="Vision description"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={visionDescriptionId}
                                value={values.visionDescription}
                                disabled={submitting}
                                rows={2}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        visionDescription: event.target.value,
                                    }))
                                }
                                className={`${adminFieldClass} resize-y`}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Call to action"
                    description="Closing prompt and button labels shown at the bottom of the page."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField id={ctaEyebrowId} label="Eyebrow">
                            <input
                                id={ctaEyebrowId}
                                value={values.ctaEyebrow}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaEyebrow: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaTitleId} label="Title">
                            <input
                                id={ctaTitleId}
                                value={values.ctaTitle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaTitle: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={ctaDescriptionId}
                            label="Description"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={ctaDescriptionId}
                                value={values.ctaDescription}
                                disabled={submitting}
                                rows={2}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaDescription: event.target.value,
                                    }))
                                }
                                className={`${adminFieldClass} resize-y`}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaPrimaryLabelId} label="Primary button label">
                            <input
                                id={ctaPrimaryLabelId}
                                value={values.ctaPrimaryLabel}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaPrimaryLabel: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaPrimaryHrefId} label="Primary button link">
                            <input
                                id={ctaPrimaryHrefId}
                                value={values.ctaPrimaryHref}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaPrimaryHref: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaSecondaryLabelId} label="Secondary button label">
                            <input
                                id={ctaSecondaryLabelId}
                                value={values.ctaSecondaryLabel}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaSecondaryLabel: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                        <AdminFormField id={ctaSecondaryHrefId} label="Secondary button link">
                            <input
                                id={ctaSecondaryHrefId}
                                value={values.ctaSecondaryHref}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        ctaSecondaryHref: event.target.value,
                                    }))
                                }
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
                    {submitting ? 'Saving…' : 'Save page content'}
                </button>
            </footer>
        </form>
    );
}
