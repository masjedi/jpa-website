import { Link, useForm } from '@inertiajs/react';
import {
    ArrowUpRight,
    Check,
    ChevronRight,
    Clock,
    Mail,
    MapPin,
    Phone,
    Send,
} from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { ContactOfficeMap } from '@/components/sections/contact/ContactOfficeMap';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

const fieldClass =
    'peer w-full border-0 border-b border-border/80 bg-transparent py-3.5 text-sm text-foreground placeholder-transparent transition-colors focus:border-secondary focus:outline-none [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--surface)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_var(--surface)] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_var(--surface)]';

const labelClass =
    'pointer-events-none absolute start-0 top-3.5 text-sm text-muted-foreground transition-all duration-200 peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-secondary peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-secondary peer-[:autofill]:-top-0.5 peer-[:autofill]:text-[11px] peer-[:autofill]:font-medium peer-[:autofill]:text-secondary peer-[-webkit-autofill]:-top-0.5 peer-[-webkit-autofill]:text-[11px] peer-[-webkit-autofill]:font-medium peer-[-webkit-autofill]:text-secondary';

type ContactField = 'name' | 'email' | 'subject' | 'message';

type ContactFormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const CONTACT_FIELD_LIMITS = {
    name: 25,
    email: 50,
    subject: 50,
    message: 200,
} as const;

type ContactValidationMessages = {
    nameMin: string;
    nameMax: string;
    email: string;
    emailMax: string;
    subjectMin: string;
    subjectMax: string;
    messageMin: string;
    messageMax: string;
};

function validateContactForm(
    data: ContactFormData,
    messages: ContactValidationMessages,
): Partial<Record<ContactField, string>> {
    const errors: Partial<Record<ContactField, string>> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameLength = data.name.trim().length;
    const emailLength = data.email.trim().length;
    const subjectLength = data.subject.trim().length;
    const messageLength = data.message.trim().length;

    if (nameLength < 2) {
        errors.name = messages.nameMin;
    } else if (nameLength > CONTACT_FIELD_LIMITS.name) {
        errors.name = messages.nameMax;
    }

    if (!emailPattern.test(data.email.trim())) {
        errors.email = messages.email;
    } else if (emailLength > CONTACT_FIELD_LIMITS.email) {
        errors.email = messages.emailMax;
    }

    if (subjectLength < 3) {
        errors.subject = messages.subjectMin;
    } else if (subjectLength > CONTACT_FIELD_LIMITS.subject) {
        errors.subject = messages.subjectMax;
    }

    if (messageLength < 10) {
        errors.message = messages.messageMin;
    } else if (messageLength > CONTACT_FIELD_LIMITS.message) {
        errors.message = messages.messageMax;
    }

    return errors;
}

export function ContactStudio() {
    const settings = useSiteSettings();
    const { t } = useTranslations();
    const formTitleId = useId();
    const [submitted, setSubmitted] = useState(false);
    const [clientErrors, setClientErrors] = useState<Partial<Record<ContactField, string>>>({});
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<ContactFormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const validationMessages: ContactValidationMessages = {
        nameMin: t('contact.errors.name'),
        nameMax: t('contact.errors.nameMax'),
        email: t('contact.errors.email'),
        emailMax: t('contact.errors.emailMax'),
        subjectMin: t('contact.errors.subject'),
        subjectMax: t('contact.errors.subjectMax'),
        messageMin: t('contact.errors.message'),
        messageMax: t('contact.errors.messageMax'),
    };

    const messageLength = data.message.length;
    const messageNearLimit = messageLength >= CONTACT_FIELD_LIMITS.message - 20;

    const channels = [
        {
            icon: Mail,
            label: t('contact.email'),
            value: settings.contactEmail,
            href: settings.contactEmailHref,
        },
        {
            icon: Phone,
            label: t('contact.whatsapp'),
            value: settings.whatsappDisplay,
            href: settings.whatsappHref,
            ltrValue: true,
        },
        {
            icon: MapPin,
            label: t('contact.location'),
            value: settings.officeLocation,
            href: settings.officeMapsHref,
            external: true,
        },
    ] as const;

    const fieldError = (field: ContactField): string | undefined =>
        errors[field] ?? clientErrors[field];

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (processing || submitted) {
            return;
        }

        const nextClientErrors = validateContactForm(data, validationMessages);

        if (Object.keys(nextClientErrors).length > 0) {
            setClientErrors(nextClientErrors);
            return;
        }

        setClientErrors({});
        clearErrors();

        post('/inquiries/contact', {
            preserveScroll: true,
            preserveState: true,
            only: ['errors', 'flash'],
            onSuccess: () => {
                setSubmitted(true);
                reset('name', 'email', 'subject', 'message');
            },
        });
    };

    return (
        <section id="contact-form" className="relative py-16 sm:py-24 lg:py-32">
            <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <FadeInOnMount>
                    <div className="grid overflow-hidden rounded-[28px] border border-border bg-surface shadow-sm lg:grid-cols-5">
                        <div
                            className="order-2 bg-surface p-6 sm:p-10 lg:order-1 lg:col-span-3"
                            role={submitted ? 'status' : undefined}
                            aria-labelledby={submitted ? undefined : formTitleId}
                        >
                            {submitted ? (
                                <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
                                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                        <Check className="size-7" aria-hidden />
                                    </div>
                                    <h2 className="font-heading mt-6 text-2xl font-semibold text-foreground">
                                        {t('contact.messageSent')}
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                        {t('contact.successMessage')}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-start">
                                    <h2
                                        id={formTitleId}
                                        className="font-heading text-xl font-semibold text-foreground"
                                    >
                                        {t('contact.formTitle')}
                                    </h2>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-8 space-y-7"
                                        noValidate
                                    >
                                        <div className="grid gap-7 sm:grid-cols-2">
                                            <div className="relative">
                                                <input
                                                    id="contact-name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    minLength={2}
                                                    maxLength={CONTACT_FIELD_LIMITS.name}
                                                    value={data.name}
                                                    onChange={(event) => {
                                                        setData('name', event.target.value);
                                                        if (clientErrors.name) {
                                                            setClientErrors((current) => ({
                                                                ...current,
                                                                name: undefined,
                                                            }));
                                                        }
                                                    }}
                                                    placeholder="Name"
                                                    autoComplete="name"
                                                    aria-invalid={fieldError('name') ? true : undefined}
                                                    className={fieldClass}
                                                />
                                                <label
                                                    htmlFor="contact-name"
                                                    className={labelClass}
                                                >
                                                    {t('contact.yourName')}
                                                </label>
                                                {fieldError('name') ? (
                                                    <p className="mt-1 text-xs text-destructive" role="alert">
                                                        {fieldError('name')}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    id="contact-email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    minLength={5}
                                                    maxLength={CONTACT_FIELD_LIMITS.email}
                                                    value={data.email}
                                                    onChange={(event) => {
                                                        setData('email', event.target.value);
                                                        if (clientErrors.email) {
                                                            setClientErrors((current) => ({
                                                                ...current,
                                                                email: undefined,
                                                            }));
                                                        }
                                                    }}
                                                    placeholder="Email"
                                                    autoComplete="email"
                                                    aria-invalid={fieldError('email') ? true : undefined}
                                                    className={fieldClass}
                                                />
                                                <label
                                                    htmlFor="contact-email"
                                                    className={labelClass}
                                                >
                                                    {t('contact.emailAddress')}
                                                </label>
                                                {fieldError('email') ? (
                                                    <p className="mt-1 text-xs text-destructive" role="alert">
                                                        {fieldError('email')}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <input
                                                id="contact-subject"
                                                name="subject"
                                                type="text"
                                                required
                                                minLength={3}
                                                maxLength={CONTACT_FIELD_LIMITS.subject}
                                                value={data.subject}
                                                onChange={(event) => {
                                                    setData('subject', event.target.value);
                                                    if (clientErrors.subject) {
                                                        setClientErrors((current) => ({
                                                            ...current,
                                                            subject: undefined,
                                                        }));
                                                    }
                                                }}
                                                placeholder="Subject"
                                                aria-invalid={fieldError('subject') ? true : undefined}
                                                className={fieldClass}
                                            />
                                            <label
                                                htmlFor="contact-subject"
                                                className={labelClass}
                                            >
                                                {t('contact.subject')}
                                            </label>
                                            {fieldError('subject') ? (
                                                <p className="mt-1 text-xs text-destructive" role="alert">
                                                    {fieldError('subject')}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                id="contact-message"
                                                name="message"
                                                required
                                                minLength={10}
                                                maxLength={CONTACT_FIELD_LIMITS.message}
                                                rows={4}
                                                value={data.message}
                                                onChange={(event) => {
                                                    setData('message', event.target.value);
                                                    if (clientErrors.message) {
                                                        setClientErrors((current) => ({
                                                            ...current,
                                                            message: undefined,
                                                        }));
                                                    }
                                                }}
                                                placeholder="Message"
                                                aria-invalid={fieldError('message') ? true : undefined}
                                                className={`${fieldClass} min-h-[7.5rem] resize-none`}
                                            />
                                            <label
                                                htmlFor="contact-message"
                                                className={labelClass}
                                            >
                                                {t('contact.howCanWeHelp')}
                                            </label>
                                            <div className="mt-1 flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    {fieldError('message') ? (
                                                        <p
                                                            className="text-xs text-destructive"
                                                            role="alert"
                                                        >
                                                            {fieldError('message')}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <p
                                                    className={cn(
                                                        'shrink-0 text-xs tabular-nums',
                                                        messageNearLimit
                                                            ? 'text-destructive'
                                                            : 'text-muted-foreground',
                                                    )}
                                                    aria-live="polite"
                                                >
                                                    {t('contact.messageCounter', {
                                                        count: messageLength,
                                                        max: CONTACT_FIELD_LIMITS.message,
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                {t('contact.submitDisclaimer')}
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                                            >
                                                {processing
                                                    ? t('buttons.sending')
                                                    : t('buttons.sendInquiry')}
                                                <Send className="size-4" aria-hidden />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        <aside className="order-1 flex flex-col justify-between bg-brand-surface p-6 text-brand-on-surface sm:p-10 lg:order-2 lg:col-span-2">
                            <div className="text-start">
                                <nav
                                    aria-label={t('common.breadcrumb')}
                                    className="flex items-center gap-2 text-xs font-medium text-brand-on-surface/60"
                                >
                                    <Link
                                        href="/"
                                        className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        {t('common.home')}
                                    </Link>
                                    <ChevronRight className="size-3.5 opacity-50 rtl:rotate-180" aria-hidden />
                                    <span className="text-brand-on-surface" aria-current="page">
                                        {t('nav.contact')}
                                    </span>
                                </nav>

                                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/55">
                                    {t('contact.eyebrow')}
                                </p>
                                <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {t('contact.title')}
                                </h1>
                                <p className="mt-4 text-sm leading-relaxed text-brand-on-surface/70">
                                    {t('contact.intro')}
                                </p>

                                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-on-surface/15 bg-brand-on-surface/5 px-3.5 py-1.5 text-xs text-brand-on-surface/75">
                                    <Clock className="size-3.5 text-accent" aria-hidden />
                                    {t('contact.replyTime')}
                                </div>
                            </div>

                            <div className="mt-10 space-y-3">
                                {channels.map((channel) => (
                                    <a
                                        key={channel.label}
                                        href={channel.href}
                                        {...('external' in channel && channel.external
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : {})}
                                        className="group flex items-start gap-3 rounded-2xl border border-brand-on-surface/10 bg-brand-on-surface/5 p-3.5 transition-colors hover:bg-brand-on-surface/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-on-surface/10 text-accent">
                                            <channel.icon className="size-4" aria-hidden />
                                        </span>
                                        <span className="min-w-0 text-start">
                                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-on-surface/55">
                                                {channel.label}
                                            </span>
                                            <span
                                                className={cn(
                                                    'mt-0.5 block truncate text-sm text-brand-on-surface',
                                                    'ltrValue' in channel &&
                                                        channel.ltrValue &&
                                                        'text-left',
                                                )}
                                                dir={
                                                    'ltrValue' in channel && channel.ltrValue
                                                        ? 'ltr'
                                                        : undefined
                                                }
                                            >
                                                {channel.value}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            className="ms-auto mt-1 size-4 shrink-0 text-brand-on-surface/40"
                                            aria-hidden
                                        />
                                    </a>
                                ))}
                            </div>
                        </aside>
                    </div>
                </FadeInOnMount>

                <ContactOfficeMap />
            </div>
        </section>
    );
}
