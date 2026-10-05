import { Link } from '@inertiajs/react';
import { AlertCircle, BadgeCheck, Clock3 } from 'lucide-react';

import { PageMeta } from '@/components/public/PageMeta';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';

type InvoiceVerifyState = 'confirmed' | 'expired';

interface InvoiceVerifyProps {
    state: InvoiceVerifyState;
    invoiceNumber: string;
    clientName: string;
    tourReference: string;
    issuedLabel: string;
    expiresLabel: string;
    status: string;
    amount: string;
    currency: string;
    brandName: string;
}

export default function InvoiceVerify({
    state,
    invoiceNumber,
    clientName,
    tourReference,
    issuedLabel,
    expiresLabel,
    status,
    amount,
}: InvoiceVerifyProps) {
    const isConfirmed = state === 'confirmed';
    const { brandName } = useSiteSettings();

    return (
        <>
            <PageMeta
                title={isConfirmed ? 'Invoice verified' : 'Verification expired'}
                description={`Verification result for invoice ${invoiceNumber} from ${brandName}.`}
                noIndex
            />
            <PublicLayout>
                <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
                    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col items-center text-center">
                            <span
                                className={cn(
                                    'inline-flex size-16 items-center justify-center rounded-full ring-1 ring-inset',
                                    isConfirmed
                                        ? 'bg-secondary/10 text-secondary ring-secondary/20'
                                        : 'bg-accent/10 text-accent ring-accent/20',
                                )}
                            >
                                {isConfirmed ? (
                                    <BadgeCheck className="size-8" aria-hidden />
                                ) : (
                                    <Clock3 className="size-8" aria-hidden />
                                )}
                            </span>

                            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                                {brandName}
                            </p>
                            <h1 className="font-heading mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
                                {isConfirmed
                                    ? 'Invoice confirmed'
                                    : 'Verification link expired'}
                            </h1>
                            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                                {isConfirmed
                                    ? `This invoice was issued by ${brandName} and matches our records.`
                                    : 'This verification link was valid for 30 days from the invoice issue date and is no longer active.'}
                            </p>
                        </div>

                        <dl className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface-muted/40 p-5 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Invoice
                                </dt>
                                <dd className="mt-1 font-medium text-foreground">{invoiceNumber}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="mt-1 font-medium text-foreground">{status}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Client
                                </dt>
                                <dd className="mt-1 font-medium text-foreground">{clientName}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Amount
                                </dt>
                                <dd className="mt-1 font-medium text-foreground">{amount}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Issued
                                </dt>
                                <dd className="mt-1 font-medium text-foreground">{issuedLabel}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Verification valid until
                                </dt>
                                <dd className="mt-1 font-medium text-foreground">{expiresLabel}</dd>
                            </div>
                            {tourReference ? (
                                <div className="sm:col-span-2">
                                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                        Tour / reference
                                    </dt>
                                    <dd className="mt-1 font-medium text-foreground">
                                        {tourReference}
                                    </dd>
                                </div>
                            ) : null}
                        </dl>

                        {!isConfirmed ? (
                            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-foreground">
                                <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                                <p>
                                    For a fresh confirmation, contact our team with your invoice
                                    number and we will re-issue verification details if needed.
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full bg-brand-surface px-6 py-2.5 text-sm font-medium text-brand-on-surface transition-colors hover:bg-brand-surface/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Contact our team
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                Back to website
                            </Link>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
                        This page confirms document authenticity only. It is not an online payment
                        receipt or automated booking confirmation.
                    </p>
                </section>
            </PublicLayout>
        </>
    );
}
