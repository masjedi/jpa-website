import { Printer, X } from 'lucide-react';
import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

import type { InvoiceDetail } from '@/components/admin/invoiceForm';
import { InvoiceQrCode } from '@/components/admin/InvoiceQrCode';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';

interface InvoiceViewDialogProps {
    open: boolean;
    invoice: InvoiceDetail | null;
    onClose: () => void;
}

const statusStyles: Record<InvoiceDetail['status'], string> = {
    Draft: 'bg-accent/15 text-accent ring-accent/20',
    Sent: 'bg-secondary/10 text-secondary ring-secondary/20',
    Paid: 'bg-primary/10 text-primary ring-primary/20',
    Overdue: 'bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400',
};

export function InvoiceViewDialog({ open, invoice, onClose }: InvoiceViewDialogProps) {
    const titleId = useId();
    const {
        brandName,
        contactEmail,
        officeLocation,
        whatsappDisplay,
        logoColor,
    } = useSiteSettings();

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose, open]);

    if (!open || !invoice || typeof document === 'undefined') {
        return null;
    }

    const handlePrint = () => {
        document.body.classList.add('printing-invoice');
        const cleanup = () => {
            document.body.classList.remove('printing-invoice');
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
        window.setTimeout(cleanup, 1000);
    };

    return createPortal(
        <>
            <style>{`
                @media print {
                    body.printing-invoice * {
                        visibility: hidden !important;
                    }
                    body.printing-invoice .invoice-print-root,
                    body.printing-invoice .invoice-print-root * {
                        visibility: visible !important;
                    }
                    body.printing-invoice .invoice-print-root {
                        position: absolute !important;
                        inset: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        color: #0f172a !important;
                        box-shadow: none !important;
                        border: 0 !important;
                        border-radius: 0 !important;
                        overflow: visible !important;
                    }
                    body.printing-invoice .invoice-no-print {
                        display: none !important;
                    }
                    body.printing-invoice .invoice-print-sheet {
                        padding: 16mm 14mm !important;
                        background: #ffffff !important;
                        color: #0f172a !important;
                    }
                    body.printing-invoice .invoice-letterhead {
                        border-color: #cbd5e1 !important;
                    }
                    body.printing-invoice .invoice-print-status {
                        border: 1px solid #a1a1aa !important;
                        color: #18181b !important;
                    }
                    body.printing-invoice .invoice-services-panel,
                    body.printing-invoice .invoice-total-panel {
                        border-color: #cbd5e1 !important;
                        background: #ffffff !important;
                    }
                    body.printing-invoice .invoice-qr-panel {
                        background: #ffffff !important;
                    }
                }
            `}</style>

            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <button
                    type="button"
                    aria-label="Close dialog"
                    className="invoice-no-print absolute inset-0 bg-brand-deep/65 backdrop-blur-[2px]"
                    onClick={onClose}
                />

                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    className="invoice-print-root relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                >
                    <header className="invoice-no-print flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                                Invoice preview
                            </p>
                            <h2
                                id={titleId}
                                className="mt-1 font-heading text-lg font-semibold text-foreground sm:text-xl"
                            >
                                {invoice.number}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">{invoice.client}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <Printer className="size-4" aria-hidden />
                                Print
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                aria-label="Close"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        </div>
                    </header>

                    <div className="invoice-print-sheet min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                        <div className="invoice-letterhead border-b border-border pb-6">
                            <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start">
                                <div className="min-w-0">
                                    <img
                                        src={logoColor}
                                        alt={brandName}
                                        width={320}
                                        height={72}
                                        className="h-11 w-auto object-contain object-left"
                                    />
                                    <p className="mt-4 max-w-xs text-sm font-medium text-foreground">
                                        {brandName}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {officeLocation}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {contactEmail}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        WhatsApp {whatsappDisplay}
                                    </p>
                                </div>

                                <InvoiceQrCode
                                    url={invoice.verificationUrl}
                                    expiresLabel={invoice.verificationExpiresLabel}
                                    active={invoice.verificationActive}
                                />

                                <div className="min-w-[12rem] text-start sm:text-end">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                                        Invoice
                                    </p>
                                    <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                                        {invoice.number}
                                    </p>
                                    <dl className="mt-4 space-y-2 text-sm">
                                        <div className="flex justify-between gap-4 sm:justify-end">
                                            <dt className="text-muted-foreground">Issued</dt>
                                            <dd className="font-medium text-foreground">
                                                {invoice.issued}
                                            </dd>
                                        </div>
                                        {invoice.dueLabel ? (
                                            <div className="flex justify-between gap-4 sm:justify-end">
                                                <dt className="text-muted-foreground">Due</dt>
                                                <dd className="font-medium text-foreground">
                                                    {invoice.dueLabel}
                                                </dd>
                                            </div>
                                        ) : null}
                                    </dl>
                                    <span
                                        className={cn(
                                            'invoice-print-status mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                            statusStyles[invoice.status],
                                        )}
                                    >
                                        {invoice.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Bill to
                                </p>
                                <p className="mt-2 font-medium text-foreground">{invoice.client}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {invoice.clientEmail}
                                </p>
                                {invoice.clientAddress ? (
                                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                                        {invoice.clientAddress}
                                    </p>
                                ) : null}
                            </div>

                            {invoice.tour ? (
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                        Tour / reference
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-foreground">
                                        {invoice.tour}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        <div className="invoice-services-panel mt-8 overflow-hidden rounded-2xl border border-border">
                            <table className="min-w-full text-sm">
                                <thead className="bg-surface-muted/70 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3">Item name</th>
                                        <th className="px-4 py-3 text-end">Fee / day</th>
                                        <th className="px-4 py-3 text-end">Days</th>
                                        <th className="px-4 py-3 text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {invoice.lineItems.map((item) => (
                                        <tr key={`${item.name}-${item.rate}-${item.days}`}>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-3 text-end text-muted-foreground">
                                                {item.rate}
                                            </td>
                                            <td className="px-4 py-3 text-end text-muted-foreground">
                                                {item.days}
                                            </td>
                                            <td className="px-4 py-3 text-end font-medium text-foreground">
                                                {item.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="space-y-2 border-t border-border px-4 py-4 text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium text-foreground">
                                        {invoice.totals.subtotal}
                                    </span>
                                </div>
                                {Number(invoice.totals.discountValue) > 0 ? (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Discount ({invoice.discountPercent}%)
                                        </span>
                                        <span className="font-medium text-foreground">
                                            -{invoice.totals.discount}
                                        </span>
                                    </div>
                                ) : null}
                                <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
                                    <span className="font-semibold text-foreground">
                                        Total payable
                                    </span>
                                    <span className="font-heading text-xl font-semibold text-foreground">
                                        {invoice.totals.totalPayable}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="invoice-total-panel mt-6 flex items-center justify-between rounded-2xl border border-border bg-brand-surface px-5 py-4 text-brand-on-surface">
                            <p className="text-sm font-medium uppercase tracking-[0.12em] text-brand-on-surface/75">
                                Amount due
                            </p>
                            <p className="font-heading text-2xl font-semibold">{invoice.amount}</p>
                        </div>

                        {invoice.notes ? (
                            <div className="mt-6 rounded-2xl border border-border bg-surface px-5 py-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Notes
                                </p>
                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
                                    {invoice.notes}
                                </p>
                            </div>
                        ) : null}

                        <p className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                            This document is prepared for trip planning and quotation purposes only.
                            It is not an online payment receipt, confirmed reservation or automated
                            booking confirmation.
                        </p>
                    </div>
                </section>
            </div>
        </>,
        document.body,
    );
}
