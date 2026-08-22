import { Mail } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';

export function FooterNewsletter() {
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
        <section
            id="newsletter"
            aria-labelledby="footer-newsletter-heading"
            className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
        >
            <div className="flex min-w-0 items-start gap-3 text-start">
                <Mail className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
                <div className="min-w-0">
                    <h2
                        id="footer-newsletter-heading"
                        className="font-heading text-base font-semibold text-foreground sm:text-lg"
                    >
                        Travel notes & inspiration
                    </h2>
                    <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        Occasional updates on itineraries, seasonal highlights and practical advice.
                    </p>
                </div>
            </div>

            {submitted ? (
                <p
                    role="status"
                    className="w-full shrink-0 rounded-full border border-border bg-background px-4 py-2.5 text-center text-sm text-foreground sm:max-w-sm sm:text-start"
                >
                    Thank you. Newsletter delivery will connect after platform approval.
                </p>
            ) : (
                <form
                    className="flex w-full shrink-0 flex-col gap-2 sm:max-w-md sm:flex-row"
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
                        className="w-full flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                    >
                        Subscribe
                    </button>
                </form>
            )}
        </section>
    );
}
