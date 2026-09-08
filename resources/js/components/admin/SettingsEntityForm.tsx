import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useMemo, useState } from 'react';

import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    mapSettingsServerErrors,
    normalizeSocialLinks,
    settingsToFormValues,
    validateSettingsFormValues,
    type AdminSiteSettings,
    type LogoSpec,
    type SettingsFormErrors,
    type SettingsFormValues,
    type SettingsSubmitPayload,
} from '@/components/admin/settingsForm';
import type { SocialLink } from '@/components/public/brand';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { cn } from '@/lib/utils';

interface SettingsEntityFormProps {
    formId: string;
    settings: AdminSiteSettings;
    logoSpec: LogoSpec;
    onCancel: () => void;
    onSubmit: (payload: SettingsSubmitPayload) => void | Promise<void>;
}

const settingsTranslatableFields = ['brandName', 'whatsappDisplay', 'officeLocation'] as const;

const emptySettingsFields = {
    brandName: '',
    whatsappDisplay: '',
    officeLocation: '',
};

export function SettingsEntityForm({
    formId,
    settings,
    logoSpec,
    onCancel,
    onSubmit,
}: SettingsEntityFormProps) {
    const pageErrors = (usePage().props.errors ?? {}) as Record<string, string>;

    const brandNameId = useId();
    const contactEmailId = useId();
    const whatsappDisplayId = useId();
    const whatsappHrefId = useId();
    const officeLocationId = useId();
    const officeMapsHrefId = useId();
    const officeMapsEmbedSrcId = useId();
    const logoColorId = useId();
    const logoWhiteId = useId();

    const startingValues = settingsToFormValues(settings);
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(settingsTranslatableFields, {
                brandName: startingValues.brandName,
                whatsappDisplay: startingValues.whatsappDisplay,
                officeLocation: startingValues.officeLocation,
            }),
        [startingValues.brandName, startingValues.officeLocation, startingValues.whatsappDisplay],
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
        emptyFields: emptySettingsFields,
    });

    const [contactEmail, setContactEmail] = useState(startingValues.contactEmail);
    const [whatsappHref, setWhatsappHref] = useState(startingValues.whatsappHref);
    const [officeMapsHref, setOfficeMapsHref] = useState(startingValues.officeMapsHref);
    const [officeMapsEmbedSrc, setOfficeMapsEmbedSrc] = useState(startingValues.officeMapsEmbedSrc);
    const [socialLinks, setSocialLinks] = useState(startingValues.socialLinks);
    const [logoColorFile, setLogoColorFile] = useState<File | null>(null);
    const [logoWhiteFile, setLogoWhiteFile] = useState<File | null>(null);
    const [logoColorPreview, setLogoColorPreview] = useState(settings.logoColor);
    const [logoWhitePreview, setLogoWhitePreview] = useState(settings.logoWhite);
    const [errors, setErrors] = useState<SettingsFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const mergedErrors = { ...mapSettingsServerErrors(pageErrors), ...errors };
    const errorMessages = Object.values(mergedErrors).filter(Boolean);
    const hasErrors = errorMessages.length > 0;

    const socialLinkFieldError = (index: number): string | undefined =>
        mergedErrors[`social_links.${index}.href`] ??
        mergedErrors[`social_links_${index}_href`];

    const fieldError = (...keys: string[]): string | undefined => {
        for (const key of keys) {
            if (mergedErrors[key]) {
                return mergedErrors[key];
            }
        }

        return undefined;
    };

    useEffect(() => {
        const nextValues = settingsToFormValues(settings);
        setContactEmail(nextValues.contactEmail);
        setWhatsappHref(nextValues.whatsappHref);
        setOfficeMapsHref(nextValues.officeMapsHref);
        setOfficeMapsEmbedSrc(nextValues.officeMapsEmbedSrc);
        setSocialLinks(nextValues.socialLinks);
        setLogoColorPreview(settings.logoColor);
        setLogoWhitePreview(settings.logoWhite);
        setLogoColorFile(null);
        setLogoWhiteFile(null);
        setErrors({});
    }, [settings]);

    const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
        setSocialLinks((current) =>
            current.map((link, linkIndex) =>
                linkIndex === index ? { ...link, ...patch } : link,
            ),
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(settingsTranslatableFields, localeValues);
        const payloadValues: SettingsFormValues = {
            brandName: translated.brandName,
            contactEmail: contactEmail.trim(),
            whatsappDisplay: translated.whatsappDisplay,
            whatsappHref: whatsappHref.trim(),
            officeLocation: translated.officeLocation,
            officeMapsHref: officeMapsHref.trim(),
            officeMapsEmbedSrc: officeMapsEmbedSrc.trim(),
            socialLinks: normalizeSocialLinks(socialLinks),
        };

        const nextErrors = validateSettingsFormValues(payloadValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            await onSubmit({
                values: payloadValues,
                logoColorFile,
                logoWhiteFile,
            });
            setLogoColorFile(null);
            setLogoWhiteFile(null);
        } catch (serverErrors) {
            if (serverErrors && typeof serverErrors === 'object') {
                setErrors(mapSettingsServerErrors(serverErrors as Record<string, string>));
            }
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
                {hasErrors ? (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-600 dark:text-red-400"
                    >
                        <p className="font-medium">Please fix the highlighted fields before saving.</p>
                        {mergedErrors.socialLinks || mergedErrors.social_links ? (
                            <p className="mt-1">{mergedErrors.socialLinks ?? mergedErrors.social_links}</p>
                        ) : null}
                    </div>
                ) : null}

                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting}
                />

                <AdminCollapsibleSection
                    title="Brand & contact"
                    description="Name and primary contact details shown across the public site."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={brandNameId}
                            label="Brand name"
                            required
                            error={fieldError('brandName', 'brand_name')}
                            className="sm:col-span-2"
                        >
                            <input
                                id={brandNameId}
                                value={draft.brandName}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('brandName', event.target.value);
                                    setErrors((current) => ({ ...current, brandName: undefined }));
                                }}
                                className={cn(
                                    adminFieldClass,
                                    fieldError('brandName', 'brand_name') && adminFieldErrorClass,
                                )}
                                aria-describedby={adminFieldDescribedBy(
                                    brandNameId,
                                    fieldError('brandName', 'brand_name'),
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={contactEmailId}
                            label="Contact email"
                            required
                            error={fieldError('contactEmail', 'contact_email')}
                        >
                            <input
                                id={contactEmailId}
                                type="email"
                                value={contactEmail}
                                disabled={submitting}
                                onChange={(event) => {
                                    setContactEmail(event.target.value);
                                    setErrors((current) => ({ ...current, contactEmail: undefined }));
                                }}
                                className={cn(
                                    adminFieldClass,
                                    fieldError('contactEmail', 'contact_email') &&
                                        adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={whatsappDisplayId}
                            label="WhatsApp display"
                            required
                            error={fieldError('whatsappDisplay', 'whatsapp_display')}
                        >
                            <input
                                id={whatsappDisplayId}
                                value={draft.whatsappDisplay}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('whatsappDisplay', event.target.value);
                                    setErrors((current) => ({
                                        ...current,
                                        whatsappDisplay: undefined,
                                    }));
                                }}
                                className={cn(
                                    adminFieldClass,
                                    fieldError('whatsappDisplay', 'whatsapp_display') &&
                                        adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={whatsappHrefId}
                            label="WhatsApp link"
                            required
                            error={fieldError('whatsappHref', 'whatsapp_href')}
                            className="sm:col-span-2"
                        >
                            <input
                                id={whatsappHrefId}
                                type="url"
                                value={whatsappHref}
                                disabled={submitting}
                                onChange={(event) => {
                                    setWhatsappHref(event.target.value);
                                    setErrors((current) => ({ ...current, whatsappHref: undefined }));
                                }}
                                className={cn(
                                    adminFieldClass,
                                    fieldError('whatsappHref', 'whatsapp_href') &&
                                        adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Office & maps"
                    description="Location label and Google Maps links used on the contact page."
                >
                    <div className="grid gap-3">
                        <AdminFormField
                            id={officeLocationId}
                            label="Office location"
                            required
                            error={fieldError('officeLocation', 'office_location')}
                        >
                            <input
                                id={officeLocationId}
                                value={draft.officeLocation}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('officeLocation', event.target.value);
                                    setErrors((current) => ({
                                        ...current,
                                        officeLocation: undefined,
                                    }));
                                }}
                                className={cn(
                                    adminFieldClass,
                                    fieldError('officeLocation', 'office_location') &&
                                        adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={officeMapsHrefId}
                            label="Google Maps link"
                            error={fieldError('officeMapsHref', 'office_maps_href')}
                        >
                            <input
                                id={officeMapsHrefId}
                                type="url"
                                value={officeMapsHref}
                                disabled={submitting}
                                onChange={(event) => setOfficeMapsHref(event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={officeMapsEmbedSrcId}
                            label="Google Maps embed URL"
                            error={fieldError('officeMapsEmbedSrc', 'office_maps_embed_src')}
                        >
                            <input
                                id={officeMapsEmbedSrcId}
                                type="url"
                                value={officeMapsEmbedSrc}
                                disabled={submitting}
                                onChange={(event) => setOfficeMapsEmbedSrc(event.target.value)}
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Social links"
                    description="Footer links for Instagram, Facebook, YouTube, and LinkedIn."
                >
                    <div className="space-y-2">
                        {socialLinks.map((link, index) => (
                            <div key={link.label} className="space-y-1">
                                <div className="grid gap-2 rounded-lg border border-border p-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                                    <input
                                        value={link.label}
                                        readOnly
                                        className={cn(adminFieldClass, 'bg-surface-muted text-xs')}
                                        aria-label={`Social network ${index + 1}`}
                                    />
                                    <input
                                        type="url"
                                        value={link.href}
                                        disabled={submitting}
                                        onChange={(event) =>
                                            updateSocialLink(index, {
                                                href: event.target.value,
                                            })
                                        }
                                        className={cn(
                                            adminFieldClass,
                                            socialLinkFieldError(index) && adminFieldErrorClass,
                                        )}
                                        aria-invalid={socialLinkFieldError(index) ? true : undefined}
                                        aria-label={`${link.label} URL`}
                                        placeholder={`https://${link.label.toLowerCase()}.com/...`}
                                    />
                                </div>
                                {socialLinkFieldError(index) ? (
                                    <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                                        {socialLinkFieldError(index)}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                        {fieldError('socialLinks', 'social_links') ? (
                            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                                {fieldError('socialLinks', 'social_links')}
                            </p>
                        ) : null}
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Logos"
                    description="Color and white logo variants used on light and dark surfaces."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={logoColorId}
                            label="Logo (color)"
                            error={fieldError('logoColor', 'logo_color')}
                        >
                            <div className="space-y-2">
                                <div className="flex min-h-16 items-center justify-center rounded-lg border border-border bg-surface-muted/50 px-3 py-2">
                                    <img
                                        src={logoColorPreview}
                                        alt="Color logo preview"
                                        className="h-9 w-auto object-contain"
                                    />
                                </div>
                                <input
                                    id={logoColorId}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    disabled={submitting}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        setLogoColorFile(file);
                                        if (file) {
                                            setLogoColorPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="block w-full text-xs text-muted-foreground file:me-2 file:rounded-lg file:border-0 file:bg-primary/10 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-primary"
                                />
                                <p className="text-[11px] text-muted-foreground">{logoSpec.hint}</p>
                            </div>
                        </AdminFormField>

                        <AdminFormField
                            id={logoWhiteId}
                            label="Logo (white)"
                            error={fieldError('logoWhite', 'logo_white')}
                        >
                            <div className="space-y-2">
                                <div className="flex min-h-16 items-center justify-center rounded-lg border border-border bg-brand-deep px-3 py-2">
                                    <img
                                        src={logoWhitePreview}
                                        alt="White logo preview"
                                        className="h-9 w-auto object-contain"
                                    />
                                </div>
                                <input
                                    id={logoWhiteId}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    disabled={submitting}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        setLogoWhiteFile(file);
                                        if (file) {
                                            setLogoWhitePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="block w-full text-xs text-muted-foreground file:me-2 file:rounded-lg file:border-0 file:bg-primary/10 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-primary"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Used on dark surfaces such as the navbar overlay and admin sidebar.
                                </p>
                            </div>
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
                    {submitting ? 'Saving…' : 'Save settings'}
                </button>
            </footer>
        </form>
    );
}
