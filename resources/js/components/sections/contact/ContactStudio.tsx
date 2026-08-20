import { Link } from '@inertiajs/react';
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
import {
    CONTACT_EMAIL,
    CONTACT_EMAIL_HREF,
    WHATSAPP_DISPLAY,
    WHATSAPP_HREF,
} from '@/components/public/brand';
import { BorderGlow } from '@/components/react-bits/BorderGlow/BorderGlow';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard/SpotlightCard';
import { cn } from '@/lib/utils';

const topics = [
    'General question',
    'Plan a custom trip',
    'Join a group tour',
    'Press & partnerships',
] as const;

type Topic = (typeof topics)[number];

const channels = [
    {
        icon: Mail,
        label: 'Email',
        value: CONTACT_EMAIL,
        href: CONTACT_EMAIL_HREF,
    },
    {
        icon: Phone,
        label: 'WhatsApp',
        value: WHATSAPP_DISPLAY,
        href: WHATSAPP_HREF,
    },
    {
        icon: MapPin,
        label: 'Office',
        value: 'Shahr-e Naw, Kabul',
        href: null,
    },
] as const;

const fieldClass =
    'peer w-full border-0 border-b border-border/80 bg-transparent py-3.5 text-sm text-foreground placeholder-transparent transition-colors focus:border-secondary focus:outline-none';

const labelClass =
    'pointer-events-none absolute start-0 top-3.5 text-sm text-muted-foreground transition-all duration-200 peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-secondary peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium';

export function ContactStudio() {
    const reducedMotion = useReducedMotion();
    const [topic, setTopic] = useState<Topic>('Plan a custom trip');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submitting || submitted) {
            return;
        }

        setSubmitting(true);
        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <section
            id="contact-form"
            className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden py-28 sm:py-32"
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
                                            className="transition-colors hover:text-brand-on-surface"
                                        >
                                            Home
                                        </Link>
                                        <ChevronRight
                                            className="size-3.5 opacity-50 rtl:rotate-180"
                                            aria-hidden
                                        />
                                        <span aria-current="page">Contact</span>
                                    </nav>

                                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand-on-surface/55">
                                        Get in touch
                                    </p>
                                    <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Start a
                                        <br />
                                        conversation
                                    </h1>
                                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-on-surface/70">
                                        Every message reaches a real person on our
                                        team — no bots, no autoresponders.
                                    </p>
                                </div>

                                <ul className="mt-10 space-y-5 text-start">
                                    {channels.map((channel) => {
                                        const Icon = channel.icon;
                                        const content = (
                                            <>
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-on-surface/15 bg-brand-on-surface/10 text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent/10">
                                                    <Icon
                                                        className="size-4"
                                                        aria-hidden
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-on-surface/50">
                                                        {channel.label}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-sm font-medium text-brand-on-surface">
                                                        {channel.value}
                                                    </p>
                                                </div>
                                                {channel.href ? (
                                                    <ArrowUpRight
                                                        className="ms-auto size-4 shrink-0 text-brand-on-surface/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                                                        aria-hidden
                                                    />
                                                ) : null}
                                            </>
                                        );

                                        return (
                                            <li key={channel.label}>
                                                {channel.href ? (
                                                    <a
                                                        href={channel.href}
                                                        {...(channel.href.startsWith('https://')
                                                            ? {
                                                                  target: '_blank',
                                                                  rel: 'noopener noreferrer',
                                                              }
                                                            : {})}
                                                        className="group flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                                    >
                                                        {content}
                                                    </a>
                                                ) : (
                                                    <div className="group flex items-center gap-4">
                                                        {content}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <SpotlightCard
                                    className="mt-8 rounded-2xl border border-brand-on-surface/10 bg-brand-on-surface/5"
                                    spotlightColor="rgba(215, 162, 58, 0.12)"
                                >
                                    <div className="flex items-start gap-3 p-4 text-start">
                                        <Clock
                                            className="mt-0.5 size-4 shrink-0 text-accent"
                                            aria-hidden
                                        />
                                        <p className="text-xs leading-relaxed text-brand-on-surface/65">
                                            Replies within two business days.
                                            Inquiries are reviewed personally —
                                            never instant confirmation.
                                        </p>
                                    </div>
                                </SpotlightCard>
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
                                            transition={{ duration: 0.45 }}
                                            className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                                            role="status"
                                        >
                                            <div className="flex size-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                                <Check
                                                    className="size-8"
                                                    aria-hidden
                                                />
                                            </div>
                                            <h2 className="font-heading mt-6 text-2xl font-semibold text-foreground">
                                                Message sent
                                            </h2>
                                            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                                Thank you for reaching out. We&apos;ll
                                                be in touch shortly.
                                            </p>
                                            <p className="mt-8 text-[11px] text-muted-foreground/60">
                                                Preview only — delivery connects
                                                after platform approval.
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
                                            >
                                                <div className="grid gap-7 sm:grid-cols-2">
                                                    <div className="relative">
                                                        <input
                                                            id="contact-name"
                                                            name="name"
                                                            type="text"
                                                            required
                                                            placeholder="Name"
                                                            autoComplete="name"
                                                            className={fieldClass}
                                                        />
                                                        <label
                                                            htmlFor="contact-name"
                                                            className={labelClass}
                                                        >
                                                            Your name
                                                        </label>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            id="contact-email"
                                                            name="email"
                                                            type="email"
                                                            required
                                                            placeholder="Email"
                                                            autoComplete="email"
                                                            className={fieldClass}
                                                        />
                                                        <label
                                                            htmlFor="contact-email"
                                                            className={labelClass}
                                                        >
                                                            Email address
                                                        </label>
                                                    </div>
                                                </div>

                                                <fieldset>
                                                    <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Topic
                                                    </legend>
                                                    <input
                                                        type="hidden"
                                                        name="topic"
                                                        value={topic}
                                                    />
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {topics.map((item) => (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() =>
                                                                    setTopic(item)
                                                                }
                                                                className={cn(
                                                                    'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                                                    topic === item
                                                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                                                        : 'border border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground',
                                                                )}
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </fieldset>

                                                <div className="relative">
                                                    <textarea
                                                        id="contact-message"
                                                        name="message"
                                                        required
                                                        rows={4}
                                                        placeholder="Message"
                                                        className={`${fieldClass} resize-none pt-1`}
                                                    />
                                                    <label
                                                        htmlFor="contact-message"
                                                        className={`${labelClass} top-1 peer-focus:top-0 peer-[:not(:placeholder-shown)]:top-0`}
                                                    >
                                                        How can we help?
                                                    </label>
                                                </div>

                                                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <p className="text-xs text-muted-foreground">
                                                        Submitting this message
                                                        does not reserve a seat
                                                        or confirm a trip.
                                                    </p>
                                                    <button
                                                        type="submit"
                                                        disabled={submitting}
                                                        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                                                    >
                                                        {submitting
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
            </div>
        </section>
    );
}
