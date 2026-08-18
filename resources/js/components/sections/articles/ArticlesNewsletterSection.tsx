import { Mail } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';

export function ArticlesNewsletterSection() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
        }
    };

    return (
        <section
            id="newsletter"
            className="border-t border-border bg-brand-surface py-14 text-brand-on-surface sm:py-16"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-on-surface/10 text-accent">
                            <Mail className="size-5" aria-hidden />
                        </div>
                        <h2 className="font-heading mt-5 text-2xl font-semibold text-brand-on-surface sm:text-3xl">
                            Travel insights in your inbox
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/75 sm:text-base">
                            Occasional updates on new guides, route notes and
                            cultural stories — no spam, unsubscribe anytime.
                        </p>

                        {submitted ? (
                            <p
                                role="status"
                                className="mt-8 rounded-2xl border border-brand-on-surface/20 bg-brand-on-surface/10 px-5 py-4 text-sm text-brand-on-surface"
                            >
                                Thank you. We&apos;ll be in touch when new articles
                                are published.
                            </p>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
                            >
                                <label htmlFor="newsletter-email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="w-full rounded-full border border-brand-on-surface/20 bg-brand-on-surface/10 px-5 py-2.5 text-sm text-brand-on-surface placeholder:text-brand-on-surface/50 focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-focus sm:max-w-xs"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}

                        <p className="mt-4 text-xs text-brand-on-surface/55">
                            Preview only — newsletter delivery will connect after
                            platform approval.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
