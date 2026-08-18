import { Link } from '@inertiajs/react';
import { Mail, MessageCircle } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';
import { AnimatedAxisDivider } from '@/components/motion/AnimatedAxisDivider';
import { planTripHref } from '@/components/public/navigation';
import { BorderGlow } from '@/components/react-bits/BorderGlow/BorderGlow';

const brandGlowColors = ['#0E7373', '#163B5C', '#D7A23A'] as const;

export function InquiryCtaBand() {
    const emailId = useId();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submitting || submitted) {
            return;
        }

        setSubmitting(true);
        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <section className="bg-background py-14 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
                    <FadeIn className="h-full">
                        <BorderGlow
                            className="h-full"
                            backgroundColor="var(--surface)"
                            borderRadius={24}
                            colors={[...brandGlowColors]}
                            glowColor="182 78 26"
                            edgeSensitivity={24}
                            glowRadius={28}
                            animated
                        >
                            <div
                                id="newsletter"
                                className="flex h-full flex-col justify-center rounded-3xl border border-border bg-surface p-8 text-center sm:p-10"
                            >
                                <Mail
                                    className="mx-auto size-8 text-secondary"
                                    aria-hidden
                                />
                                <h2 className="font-heading mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                                    Travel notes & inspiration
                                </h2>
                                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Occasional updates on itineraries, seasonal
                                    highlights and practical advice.
                                </p>
                                {submitted ? (
                                    <p
                                        role="status"
                                        className="mx-auto mt-7 max-w-md rounded-2xl border border-border bg-background px-5 py-3 text-sm text-foreground"
                                    >
                                        Thank you. Newsletter delivery will
                                        connect after platform approval.
                                    </p>
                                ) : (
                                    <form
                                        className="mx-auto mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                                        onSubmit={handleNewsletterSubmit}
                                    >
                                        <label htmlFor={emailId} className="sr-only">
                                            Email address
                                        </label>
                                        <input
                                            id={emailId}
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            required
                                            autoComplete="email"
                                            className="w-full flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                                        >
                                            Subscribe
                                        </button>
                                    </form>
                                )}
                            </div>
                        </BorderGlow>
                    </FadeIn>

                    <AnimatedAxisDivider axis="x" className="my-2" />
                    <AnimatedAxisDivider axis="y" className="mx-6" />

                    <FadeIn delay={0.08} className="h-full">
                        <BorderGlow
                            className="h-full"
                            backgroundColor="var(--surface)"
                            borderRadius={24}
                            colors={[...brandGlowColors]}
                            glowColor="40 65 55"
                            edgeSensitivity={24}
                            glowRadius={28}
                            animated
                        >
                            <div
                                id="contact"
                                className="flex h-full flex-col justify-center rounded-3xl border border-border bg-surface p-8 text-center sm:p-10"
                            >
                                <MessageCircle
                                    className="mx-auto size-8 text-accent"
                                    aria-hidden
                                />
                                <h2 className="font-heading mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                                    Ready to plan your journey?
                                </h2>
                                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Send a booking inquiry — our team reviews
                                    every request and replies with a tailored
                                    quotation. Submitting an inquiry does not
                                    reserve a seat or confirm a trip.
                                </p>
                                <Link
                                    href={planTripHref}
                                    prefetch
                                    className="mx-auto mt-7 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Plan My Trip
                                </Link>
                            </div>
                        </BorderGlow>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
