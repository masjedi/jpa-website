import { Head, router, usePage } from '@inertiajs/react';
import { Globe, Palette, Settings as SettingsIcon, Shield } from 'lucide-react';
import { type FormEvent, useEffect, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import type { SiteSettings, SocialLink } from '@/components/public/brand';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';

interface LogoSpec {
    width: number;
    height: number;
    aspect_ratio: string | null;
    max_upload_kilobytes: number;
    hint: string;
}

interface SettingsPageProps {
    settings: SiteSettings;
    logoSpec: LogoSpec;
}

interface SettingsFormValues {
    brandName: string;
    contactEmail: string;
    whatsappDisplay: string;
    whatsappHref: string;
    officeLocation: string;
    officeMapsHref: string;
    officeMapsEmbedSrc: string;
    socialLinks: SocialLink[];
}

type SettingsFormErrors = Partial<
    Record<
        | 'brandName'
        | 'contactEmail'
        | 'whatsappDisplay'
        | 'whatsappHref'
        | 'officeLocation'
        | 'officeMapsHref'
        | 'officeMapsEmbedSrc'
        | 'socialLinks'
        | 'logoColor'
        | 'logoWhite'
        | string,
        string
    >
>;

const comingSoonGroups = [
    {
        title: 'Appearance',
        description: 'Theme defaults, accent usage, and localized layout preferences.',
        icon: Palette,
    },
    {
        title: 'Access & security',
        description: 'Administrator accounts, session policies, and audit preferences.',
        icon: Shield,
    },
] as const;

function settingsToFormValues(settings: SiteSettings): SettingsFormValues {
    return {
        brandName: settings.brandName,
        contactEmail: settings.contactEmail,
        whatsappDisplay: settings.whatsappDisplay,
        whatsappHref: settings.whatsappHref,
        officeLocation: settings.officeLocation,
        officeMapsHref: settings.officeMapsHref,
        officeMapsEmbedSrc: settings.officeMapsEmbedSrc,
        socialLinks: settings.socialLinks.map((link) => ({ ...link })),
    };
}

function buildSettingsFormData(
    values: SettingsFormValues,
    logoColor: File | null,
    logoWhite: File | null,
): FormData {
    const formData = new FormData();
    formData.append('_method', 'patch');
    formData.append('brand_name', values.brandName.trim());
    formData.append('contact_email', values.contactEmail.trim());
    formData.append('whatsapp_display', values.whatsappDisplay.trim());
    formData.append('whatsapp_href', values.whatsappHref.trim());
    formData.append('office_location', values.officeLocation.trim());
    formData.append('office_maps_href', values.officeMapsHref.trim());
    formData.append('office_maps_embed_src', values.officeMapsEmbedSrc.trim());

    values.socialLinks.forEach((link, index) => {
        formData.append(`social_links[${index}][label]`, link.label.trim());
        formData.append(`social_links[${index}][href]`, link.href.trim());
    });

    if (logoColor) {
        formData.append('logo_color', logoColor);
    }

    if (logoWhite) {
        formData.append('logo_white', logoWhite);
    }

    return formData;
}

function mapServerErrors(errors: Record<string, string>): SettingsFormErrors {
    const mapped: SettingsFormErrors = {};

    Object.entries(errors).forEach(([key, message]) => {
        const camel = key
            .replace(/\.(\d+)\./g, '.$1.')
            .replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
            .replace(/\./g, '_');

        mapped[camel] = message;
        mapped[key] = message;
    });

    return mapped;
}

export default function Settings({ settings, logoSpec }: SettingsPageProps) {
    const page = usePage();
    const flash = page.props.flash;
    const pageErrors = (page.props.errors ?? {}) as Record<string, string>;
    const formId = useId();
    const [values, setValues] = useState<SettingsFormValues>(() => settingsToFormValues(settings));
    const [logoColorFile, setLogoColorFile] = useState<File | null>(null);
    const [logoWhiteFile, setLogoWhiteFile] = useState<File | null>(null);
    const [logoColorPreview, setLogoColorPreview] = useState(settings.logoColor);
    const [logoWhitePreview, setLogoWhitePreview] = useState(settings.logoWhite);
    const [errors, setErrors] = useState<SettingsFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const brandNameId = useId();
    const contactEmailId = useId();
    const whatsappDisplayId = useId();
    const whatsappHrefId = useId();
    const officeLocationId = useId();
    const officeMapsHrefId = useId();
    const officeMapsEmbedSrcId = useId();
    const logoColorId = useId();
    const logoWhiteId = useId();

    useEffect(() => {
        setValues(settingsToFormValues(settings));
        setLogoColorPreview(settings.logoColor);
        setLogoWhitePreview(settings.logoWhite);
        setLogoColorFile(null);
        setLogoWhiteFile(null);
    }, [settings]);

    const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
        setValues((current) => ({
            ...current,
            socialLinks: current.socialLinks.map((link, linkIndex) =>
                linkIndex === index ? { ...link, ...patch } : link,
            ),
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});

        router.post('/admin/settings', buildSettingsFormData(values, logoColorFile, logoWhiteFile), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setLogoColorFile(null);
                setLogoWhiteFile(null);
                setSubmitting(false);
            },
            onError: (serverErrors) => {
                setErrors(mapServerErrors(serverErrors));
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Settings" />

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
                    eyebrow="Configuration"
                    title="Settings"
                    description="Manage global website settings, branding, localization readiness, and administrative preferences."
                    icon={SettingsIcon}
                />

                <AdminSectionPanel
                    title="Site identity"
                    description="These details appear on the public website, footer, contact page, and printable documents."
                >
                    <form id={formId} onSubmit={handleSubmit} className="space-y-6" aria-busy={submitting}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <AdminFormField
                                id={brandNameId}
                                label="Brand name"
                                required
                                error={errors.brandName ?? pageErrors.brand_name}
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
                                        (errors.brandName || pageErrors.brand_name) &&
                                            adminFieldErrorClass,
                                    )}
                                    aria-describedby={adminFieldDescribedBy(
                                        brandNameId,
                                        errors.brandName ?? pageErrors.brand_name,
                                    )}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id={contactEmailId}
                                label="Contact email"
                                required
                                error={errors.contactEmail ?? pageErrors.contact_email}
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
                                        (errors.contactEmail || pageErrors.contact_email) &&
                                            adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id={officeLocationId}
                                label="Office location"
                                required
                                error={errors.officeLocation ?? pageErrors.office_location}
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
                                        (errors.officeLocation || pageErrors.office_location) &&
                                            adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id={whatsappDisplayId}
                                label="WhatsApp display"
                                required
                                error={errors.whatsappDisplay ?? pageErrors.whatsapp_display}
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
                                        (errors.whatsappDisplay || pageErrors.whatsapp_display) &&
                                            adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id={whatsappHrefId}
                                label="WhatsApp link"
                                required
                                error={errors.whatsappHref ?? pageErrors.whatsapp_href}
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
                                        (errors.whatsappHref || pageErrors.whatsapp_href) &&
                                            adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id={officeMapsHrefId}
                                label="Google Maps link"
                                error={errors.officeMapsHref ?? pageErrors.office_maps_href}
                                className="sm:col-span-2"
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
                                    className={cn(adminFieldClass)}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id={officeMapsEmbedSrcId}
                                label="Google Maps embed URL"
                                error={
                                    errors.officeMapsEmbedSrc ?? pageErrors.office_maps_embed_src
                                }
                                className="sm:col-span-2"
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
                                    className={cn(adminFieldClass)}
                                />
                            </AdminFormField>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-foreground">Social links</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Instagram, Facebook, YouTube and LinkedIn appear in the public
                                    footer.
                                </p>
                            </div>
                            <div className="space-y-3">
                                {values.socialLinks.map((link, index) => (
                                    <div
                                        key={link.label}
                                        className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[8rem_minmax(0,1fr)]"
                                    >
                                        <input
                                            value={link.label}
                                            readOnly
                                            className={cn(adminFieldClass, 'bg-surface-muted')}
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
                                            className={adminFieldClass}
                                            aria-label={`${link.label} URL`}
                                        />
                                    </div>
                                ))}
                            </div>
                            {errors.socialLinks || pageErrors.social_links ? (
                                <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                                    {errors.socialLinks ?? pageErrors.social_links}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <AdminFormField
                                id={logoColorId}
                                label="Logo (color)"
                                error={errors.logoColor ?? pageErrors.logo_color}
                            >
                                <div className="space-y-3">
                                    <div className="flex min-h-20 items-center justify-center rounded-xl border border-border bg-surface-muted/50 px-4 py-3">
                                        <img
                                            src={logoColorPreview}
                                            alt="Color logo preview"
                                            className="h-10 w-auto object-contain"
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
                                        className="block w-full text-sm text-muted-foreground file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        {logoSpec.hint}
                                    </p>
                                </div>
                            </AdminFormField>

                            <AdminFormField
                                id={logoWhiteId}
                                label="Logo (white)"
                                error={errors.logoWhite ?? pageErrors.logo_white}
                            >
                                <div className="space-y-3">
                                    <div className="flex min-h-20 items-center justify-center rounded-xl border border-border bg-brand-deep px-4 py-3">
                                        <img
                                            src={logoWhitePreview}
                                            alt="White logo preview"
                                            className="h-10 w-auto object-contain"
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
                                        className="block w-full text-sm text-muted-foreground file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Used on dark surfaces such as the navbar overlay and admin
                                        sidebar.
                                    </p>
                                </div>
                            </AdminFormField>
                        </div>

                        <div className="flex justify-end border-t border-border pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? 'Saving…' : 'Save settings'}
                            </button>
                        </div>
                    </form>
                </AdminSectionPanel>

                <div className="grid gap-4 lg:grid-cols-2">
                    {comingSoonGroups.map((group) => {
                        const Icon = group.icon;

                        return (
                            <AdminSectionPanel
                                key={group.title}
                                title={group.title}
                                description={group.description}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-4" aria-hidden />
                                    </span>
                                    <div>
                                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                            <Globe className="size-3.5" aria-hidden />
                                            Coming soon
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Configuration controls for this group will be added in a
                                            later phase.
                                        </p>
                                    </div>
                                </div>
                            </AdminSectionPanel>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Settings.layout = withAdminLayout('Settings');
