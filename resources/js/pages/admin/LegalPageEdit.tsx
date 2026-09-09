import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { TranslatableFormShell } from '@/components/admin/TranslatableFormShell';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';
import type { AdminLegalPage, AdminLegalSection } from '@/types/legalPage';
import { LOCALE_CODES, type LocaleCode, type TranslatedString } from '@/types/locale';

interface LegalPageEditProps {
    page: AdminLegalPage;
}

type HeaderFields = {
    eyebrow: string;
    title: string;
    intro: string;
};

const emptyHeader: HeaderFields = {
    eyebrow: '',
    title: '',
    intro: '',
};

const emptySection = (): AdminLegalSection => ({
    title: '',
    body: '',
    link_href: '',
    link_label: '',
});

function toHeaderByLocale(page: AdminLegalPage): Record<LocaleCode, HeaderFields> {
    return Object.fromEntries(
        LOCALE_CODES.map((locale) => [
            locale,
            {
                eyebrow: page.eyebrow[locale] ?? '',
                title: page.title[locale] ?? '',
                intro: page.intro[locale] ?? '',
            },
        ]),
    ) as Record<LocaleCode, HeaderFields>;
}

function emptySectionsByLocale(): Record<LocaleCode, AdminLegalSection[]> {
    return Object.fromEntries(LOCALE_CODES.map((locale) => [locale, []])) as Record<
        LocaleCode,
        AdminLegalSection[]
    >;
}

export default function LegalPageEdit({ page }: LegalPageEditProps) {
    const { flash, errors } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [sectionsByLocale, setSectionsByLocale] = useState<Record<LocaleCode, AdminLegalSection[]>>(
        () => ({
            ...emptySectionsByLocale(),
            ...Object.fromEntries(
                LOCALE_CODES.map((locale) => [locale, [...(page.sections[locale] ?? [])]]),
            ),
        }),
    );
    const [formError, setFormError] = useState<string | null>(null);

    const initialByLocale = useMemo(() => toHeaderByLocale(page), [page]);

    const updateSection = (
        locale: LocaleCode,
        index: number,
        key: keyof AdminLegalSection,
        value: string,
    ) => {
        setSectionsByLocale((current) => {
            const next = [...(current[locale] ?? [])];
            next[index] = { ...next[index], [key]: value };

            return { ...current, [locale]: next };
        });
    };

    const addSection = (locale: LocaleCode) => {
        setSectionsByLocale((current) => ({
            ...current,
            [locale]: [...(current[locale] ?? []), emptySection()],
        }));
    };

    const removeSection = (locale: LocaleCode, index: number) => {
        setSectionsByLocale((current) => ({
            ...current,
            [locale]: (current[locale] ?? []).filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const submit = (commitAllLocales: () => Record<LocaleCode, HeaderFields>) => {
        const headers = commitAllLocales();
        const eyebrow = Object.fromEntries(
            LOCALE_CODES.map((locale) => [locale, headers[locale].eyebrow]),
        ) as TranslatedString;
        const title = Object.fromEntries(
            LOCALE_CODES.map((locale) => [locale, headers[locale].title]),
        ) as TranslatedString;
        const intro = Object.fromEntries(
            LOCALE_CODES.map((locale) => [locale, headers[locale].intro]),
        ) as TranslatedString;

        if (!title.en.trim() || !eyebrow.en.trim() || !intro.en.trim()) {
            setFormError('English eyebrow, title, and intro are required.');

            return;
        }

        if ((sectionsByLocale.en ?? []).filter((section) => section.title.trim() && section.body.trim()).length < 1) {
            setFormError('Add at least one English section with a title and body.');

            return;
        }

        setFormError(null);
        setProcessing(true);

        router.patch(
            `/admin/legal-pages/${page.key}`,
            {
                eyebrow,
                title,
                intro,
                sections: sectionsByLocale,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="space-y-4">
            {flash.success ? (
                <div
                    role="status"
                    className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                >
                    {flash.success}
                </div>
            ) : null}

            <AdminSectionHeader
                eyebrow="Legal pages"
                title={page.label}
                description="Update localized headings and sections for this public legal page."
                icon={FileText}
                actions={
                    <Link
                        href="/admin/legal-pages"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                        All legal pages
                    </Link>
                }
            />

            <AdminSectionPanel title="Page content" description="Switch languages with the locale selector. English is required.">
                <TranslatableFormShell initialByLocale={initialByLocale} emptyFields={emptyHeader} disabled={processing}>
                    {({ draft, setField, direction, commitAllLocales, activeLocale }) => {
                        const sections = sectionsByLocale[activeLocale] ?? [];

                        return (
                            <div className="space-y-5" dir={direction}>
                                {(formError || errors.title || errors.eyebrow || errors.intro || errors.sections) && (
                                    <p className="text-sm text-destructive" role="alert">
                                        {formError
                                            || (typeof errors.title === 'string' ? errors.title : null)
                                            || (typeof errors.eyebrow === 'string' ? errors.eyebrow : null)
                                            || (typeof errors.intro === 'string' ? errors.intro : null)
                                            || (typeof errors.sections === 'string' ? errors.sections : null)
                                            || 'Please review the form and try again.'}
                                    </p>
                                )}

                                <AdminCollapsibleSection
                                    title="Page header"
                                    description="Eyebrow, title, and intro"
                                    defaultOpen={false}
                                    error={Boolean(errors.eyebrow || errors.title || errors.intro)}
                                >
                                    <div className="space-y-4">
                                        <AdminFormField id="eyebrow" label="Eyebrow" required={activeLocale === 'en'}>
                                            <input
                                                id="eyebrow"
                                                value={draft.eyebrow}
                                                onChange={(event) => setField('eyebrow', event.target.value)}
                                                className={cn(adminFieldClass, errors.eyebrow && adminFieldErrorClass)}
                                            />
                                        </AdminFormField>

                                        <AdminFormField id="title" label="Title" required={activeLocale === 'en'}>
                                            <input
                                                id="title"
                                                value={draft.title}
                                                onChange={(event) => setField('title', event.target.value)}
                                                className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                                            />
                                        </AdminFormField>

                                        <AdminFormField id="intro" label="Intro" required={activeLocale === 'en'}>
                                            <textarea
                                                id="intro"
                                                rows={4}
                                                value={draft.intro}
                                                onChange={(event) => setField('intro', event.target.value)}
                                                className={cn(adminFieldClass, errors.intro && adminFieldErrorClass)}
                                            />
                                        </AdminFormField>
                                    </div>
                                </AdminCollapsibleSection>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-semibold text-foreground">Sections</h3>
                                        <button
                                            type="button"
                                            onClick={() => addSection(activeLocale)}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:underline"
                                        >
                                            <Plus className="size-3.5" aria-hidden />
                                            Add section
                                        </button>
                                    </div>

                                    {sections.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No sections for this language yet. English sections are required.
                                        </p>
                                    ) : null}

                                    {sections.map((section, index) => (
                                        <AdminCollapsibleSection
                                            key={`${activeLocale}-${index}`}
                                            title={section.title.trim() || `Section ${index + 1}`}
                                            description={
                                                section.body.trim()
                                                    ? section.body.trim().slice(0, 80)
                                                    : 'Empty section'
                                            }
                                            defaultOpen={false}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSection(activeLocale, index)}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                                                    >
                                                        <Trash2 className="size-3.5" aria-hidden />
                                                        Remove
                                                    </button>
                                                </div>

                                                <AdminFormField
                                                    id={`section-title-${index}`}
                                                    label="Section title"
                                                    required={activeLocale === 'en'}
                                                >
                                                    <input
                                                        id={`section-title-${index}`}
                                                        value={section.title}
                                                        onChange={(event) =>
                                                            updateSection(
                                                                activeLocale,
                                                                index,
                                                                'title',
                                                                event.target.value,
                                                            )
                                                        }
                                                        className={adminFieldClass}
                                                    />
                                                </AdminFormField>

                                                <AdminFormField
                                                    id={`section-body-${index}`}
                                                    label="Section body"
                                                    required={activeLocale === 'en'}
                                                >
                                                    <textarea
                                                        id={`section-body-${index}`}
                                                        rows={4}
                                                        value={section.body}
                                                        onChange={(event) =>
                                                            updateSection(
                                                                activeLocale,
                                                                index,
                                                                'body',
                                                                event.target.value,
                                                            )
                                                        }
                                                        className={adminFieldClass}
                                                    />
                                                </AdminFormField>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <AdminFormField
                                                        id={`section-link-href-${index}`}
                                                        label="Optional link href"
                                                    >
                                                        <input
                                                            id={`section-link-href-${index}`}
                                                            value={section.link_href}
                                                            dir="ltr"
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    activeLocale,
                                                                    index,
                                                                    'link_href',
                                                                    event.target.value,
                                                                )
                                                            }
                                                            className={adminFieldClass}
                                                            placeholder="/contact"
                                                        />
                                                    </AdminFormField>

                                                    <AdminFormField
                                                        id={`section-link-label-${index}`}
                                                        label="Optional link label"
                                                    >
                                                        <input
                                                            id={`section-link-label-${index}`}
                                                            value={section.link_label}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    activeLocale,
                                                                    index,
                                                                    'link_label',
                                                                    event.target.value,
                                                                )
                                                            }
                                                            className={adminFieldClass}
                                                            placeholder="contact page"
                                                        />
                                                    </AdminFormField>
                                                </div>
                                            </div>
                                        </AdminCollapsibleSection>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => submit(commitAllLocales)}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Saving…' : 'Save legal page'}
                                </button>
                            </div>
                        );
                    }}
                </TranslatableFormShell>
            </AdminSectionPanel>
        </div>
    );
}

LegalPageEdit.layout = withAdminLayout('Legal pages');
