import { useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';

export function FooterNewsletter() {
    const emailId = useId();
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
        source: 'footer',
    });

    const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (processing || submitted) {
            return;
        }

        clearErrors();

        post('/newsletter/subscribe', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                setData('email', '');
            },
        });
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
                    Thank you. We&apos;ll send travel notes when new guides and updates are
                    published.
                </p>
            ) : (
                <form
                    className="flex w-full shrink-0 flex-col gap-2 sm:max-w-md sm:flex-row"
                    onSubmit={handleNewsletterSubmit}
                    noValidate
                >
                    <div className="flex w-full flex-1 flex-col gap-1">
                        <label htmlFor={emailId} className="sr-only">
                            Email address
                        </label>
                        <input
                            id={emailId}
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            aria-invalid={errors.email ? true : undefined}
                            aria-describedby={errors.email ? `${emailId}-error` : undefined}
                            className="w-full flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        />
                        {errors.email ? (
                            <p
                                id={`${emailId}-error`}
                                className="px-4 text-xs text-destructive"
                                role="alert"
                            >
                                {errors.email}
                            </p>
                        ) : null}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                    >
                        {processing ? 'Subscribing…' : 'Subscribe'}
                    </button>
                </form>
            )}
        </section>
    );
}
