import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useState } from 'react';

import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    mapSettingsServerErrors,
    normalizeSocialLinks,
    settingsToFormValues,
    type LogoSpec,
    type SettingsFormErrors,
    type SettingsFormValues,
    type SettingsSubmitPayload,
} from '@/components/admin/settingsForm';
import type { SiteSettings, SocialLink } from '@/components/public/brand';
import { cn } from '@/lib/utils';

interface SettingsEntityFormProps {
    formId: string;
    settings: SiteSettings;
    logoSpec: LogoSpec;
    onCancel: () => void;
    onSubmit: (payload: SettingsSubmitPayload) => void | Promise<void>;
}

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

    const [values, setValues] = useState<SettingsFormValues>(() => settingsToFormValues(settings));
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
        setValues(settingsToFormValues(settings));
        setLogoColorPreview(settings.logoColor);
        setLogoWhitePreview(settings.logoWhite);
        setLogoColorFile(null);
        setLogoWhiteFile(null);
        setErrors({});
    }, [settings]);

    const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
        setValues((current) => ({
            ...current,
            socialLinks: current.socialLinks.map((link, linkIndex) =>
                linkIndex === index ? { ...link, ...patch } : link,
            ),
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await onSubmit({
                values: {
                    ...values,
                    socialLinks: normalizeSocialLinks(values.socialLinks),
                },
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
                                value={values.brandName}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        brandName: event.target.value,
                                    }))
                                }
                                className={cn(
                                    adminFieldClass,
                                    (fieldError('brandName', 'brand_name')) &&
                                        adminFieldErrorClass,
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
                                value={values.contactEmail}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        contactEmail: event.target.value,
                                    }))
                                }
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
                                value={values.whatsappDisplay}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        whatsappDisplay: event.target.value,
                                    }))
                                }
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
                                value={values.whatsappHref}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        whatsappHref: event.target.value,
                                    }))
                                }
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
                                value={values.officeLocation}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        officeLocation: event.target.value,
                                    }))
                                }
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
                                value={values.officeMapsHref}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        officeMapsHref: event.target.value,
                                    }))
                                }
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
                                value={values.officeMapsEmbedSrc}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        officeMapsEmbedSrc: event.target.value,
                                    }))
                                }
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
                        {values.socialLinks.map((link, index) => (
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
