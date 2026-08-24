import { Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
import { type FormEvent, useState } from 'react';

import { FadeInOnMount } from '@/components/motion/FadeIn';
import { ContactOfficeMap } from '@/components/sections/contact/ContactOfficeMap';
import { BorderGlow } from '@/components/react-bits/BorderGlow/BorderGlow';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';

const topics = [
    'General question',
    'Plan a custom trip',
    'Join a group tour',
    'Press & partnerships',
] as const;

type Topic = (typeof topics)[number];

const fieldClass =
    'peer w-full border-0 border-b border-border/80 bg-transparent py-3.5 text-sm text-foreground placeholder-transparent transition-colors focus:border-secondary focus:outline-none';

const labelClass =
    'pointer-events-none absolute start-0 top-3.5 text-sm text-muted-foreground transition-all duration-200 peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-secondary peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-secondary';

export function ContactStudio() {
    const reducedMotion = useReducedMotion();
    const settings = useSiteSettings();
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        topic: 'Plan a custom trip' as Topic,
        message: '',
    });

    const channels = [
        {
            icon: Mail,
            label: 'Email',
            value: settings.contactEmail,
            href: settings.contactEmailHref,
        },
        {
            icon: Phone,
            label: 'WhatsApp',
            value: settings.whatsappDisplay,
            href: settings.whatsappHref,
        },
        {
            icon: MapPin,
            label: 'Location',
            value: settings.officeLocation,
            href: settings.officeMapsHref,
            external: true,
        },
    ] as const;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (processing || submitted) {
            return;
        }

        clearErrors();

        post('/inquiries/contact', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset('name', 'email', 'message');
            },
        });
    };

    return (
        <section
            id="contact-form"
            className="relative overflow-hidden py-28 sm:py-32"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/4 top-1/4 size-72 rounded-full bg-secondary/20 blur-[100px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-1/4 right-1/4 size-56 rounded-full bg-accent/15 blur-[80px]"
            />

            <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <FadeInOnMount>
                    <BorderGlow
                        animated
                        className="w-full"
                        backgroundColor="var(--surface)"
                        borderRadius={28}
                        colors={['#0E7373', '#163B5C', '#D7A23A']}
                        glowColor="182 78 26"
                        edgeSensitivity={28}
                        glowRadius={32}
                        glowIntensity={0.95}
                        coneSpread={24}
                        fillOpacity={0.4}
                    >
                        <div className="grid overflow-hidden rounded-[28px] lg:grid-cols-5">
                            <aside className="flex flex-col justify-between bg-brand-surface p-8 text-brand-on-surface sm:p-10 lg:col-span-2">
                                <div className="text-start">
                                    <nav
                                        aria-label="Breadcrumb"
                                        className="flex items-center gap-2 text-xs font-medium text-brand-on-surface/60"
                                    >
                                        <Link
                                            href="/"
                                            className="transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            Home
                                        </Link>
                                        <ChevronRight className="size-3.5 opacity-50" aria-hidden />
                                        <span className="text-brand-on-surface" aria-current="page">
                                            Contact
                                        </span>
                                    </nav>

                                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/55">
                                        Get in touch
                                    </p>
                                    <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Plan your journey with us
                                    </h1>
                                    <p className="mt-4 text-sm leading-relaxed text-brand-on-surface/70">
                                        Every message is reviewed personally. Submitting a form
                                        does not reserve a seat or confirm a trip.
                                    </p>

                                    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-on-surface/15 bg-brand-on-surface/5 px-3.5 py-1.5 text-xs text-brand-on-surface/75">
                                        <Clock className="size-3.5 text-accent" aria-hidden />
                                        Typical reply within 24–48 hours
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
                                                <span className="mt-0.5 block truncate text-sm text-brand-on-surface">
                                                    {channel.value}
                                                </span>
                                            </span>
                                            <ArrowUpRight
                                                className="ms-auto mt-1 size-4 shrink-0 text-brand-on-surface/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                aria-hidden
                                            />
                                        </a>
                                    ))}
                                </div>
                            </aside>

                            <div className="bg-surface p-8 sm:p-10 lg:col-span-3">
                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={
                                                reducedMotion
                                                    ? false
                                                    : { opacity: 0, y: 12 }
                                            }
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={
                                                reducedMotion
                                                    ? undefined
                                                    : { opacity: 0, y: -8 }
                                            }
                                            transition={{ duration: 0.35 }}
                                            className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                                            role="status"
                                        >
                                            <div className="inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                                <Check className="size-7" aria-hidden />
                                            </div>
                                            <h2 className="font-heading mt-6 text-2xl font-semibold text-foreground">
                                                Message sent
                                            </h2>
                                            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                                Thank you for reaching out. We&apos;ll
                                                be in touch shortly.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="form"
                                            initial={
                                                reducedMotion
                                                    ? false
                                                    : { opacity: 0, y: 12 }
                                            }
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={
                                                reducedMotion
                                                    ? undefined
                                                    : { opacity: 0, y: -8 }
                                            }
                                            transition={{ duration: 0.35 }}
                                            className="text-start"
                                        >
                                            <h2 className="font-heading text-xl font-semibold text-foreground">
                                                Send a message
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
                                                            value={data.name}
                                                            onChange={(event) =>
                                                                setData('name', event.target.value)
                                                            }
                                                            placeholder="Name"
                                                            autoComplete="name"
                                                            aria-invalid={errors.name ? true : undefined}
                                                            className={fieldClass}
                                                        />
                                                        <label
                                                            htmlFor="contact-name"
                                                            className={labelClass}
                                                        >
                                                            Your name
                                                        </label>
                                                        {errors.name ? (
                                                            <p className="mt-1 text-xs text-destructive" role="alert">
                                                                {errors.name}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            id="contact-email"
                                                            name="email"
                                                            type="email"
                                                            required
                                                            value={data.email}
                                                            onChange={(event) =>
                                                                setData('email', event.target.value)
                                                            }
                                                            placeholder="Email"
                                                            autoComplete="email"
                                                            aria-invalid={errors.email ? true : undefined}
                                                            className={fieldClass}
                                                        />
                                                        <label
                                                            htmlFor="contact-email"
                                                            className={labelClass}
                                                        >
                                                            Email address
                                                        </label>
                                                        {errors.email ? (
                                                            <p className="mt-1 text-xs text-destructive" role="alert">
                                                                {errors.email}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <fieldset>
                                                    <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Topic
                                                    </legend>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {topics.map((item) => (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData('topic', item)
                                                                }
                                                                className={cn(
                                                                    'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                                                    data.topic === item
                                                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                                                        : 'border border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground',
                                                                )}
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {errors.topic ? (
                                                        <p className="mt-1 text-xs text-destructive" role="alert">
                                                            {errors.topic}
                                                        </p>
                                                    ) : null}
                                                </fieldset>

                                                <div className="relative">
                                                    <textarea
                                                        id="contact-message"
                                                        name="message"
                                                        required
                                                        rows={4}
                                                        value={data.message}
                                                        onChange={(event) =>
                                                            setData('message', event.target.value)
                                                        }
                                                        placeholder="Message"
                                                        aria-invalid={errors.message ? true : undefined}
                                                        className={`${fieldClass} min-h-[7.5rem] resize-none`}
                                                    />
                                                    <label
                                                        htmlFor="contact-message"
                                                        className={labelClass}
                                                    >
                                                        How can we help?
                                                    </label>
                                                    {errors.message ? (
                                                        <p className="mt-1 text-xs text-destructive" role="alert">
                                                            {errors.message}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <p className="text-xs text-muted-foreground">
                                                        Submitting this message
                                                        does not reserve a seat
                                                        or confirm a trip.
                                                    </p>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                                                    >
                                                        {processing
                                                            ? 'Sending…'
                                                            : 'Send message'}
                                                        <Send
                                                            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                            aria-hidden
                                                        />
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </BorderGlow>
                </FadeInOnMount>

                <ContactOfficeMap />
            </div>
        </section>
    );
}
