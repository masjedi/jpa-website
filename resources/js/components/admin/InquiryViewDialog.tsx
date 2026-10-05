import { Printer, X } from 'lucide-react';
import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';

export interface InquiryDetail {
    id: number;
    name: string;
    email: string;
    tour: string;
    status: 'New' | 'In review' | 'Awaiting reply' | 'Closed';
    source: string;
    sourceValue?: string;
    isSeasonalPackage?: boolean;
    requestKind?: string;
    packagePrice?: string;
    received: string;
    receivedAt?: string;
    message: string;
    phone?: string;
    nationality?: string;
    preferredDate?: string;
    travelerCount?: string;
}

interface InquiryViewDialogProps {
    open: boolean;
    inquiry: InquiryDetail | null;
    onClose: () => void;
}

const statusStyles: Record<InquiryDetail['status'], string> = {
    New: 'bg-accent/15 text-accent ring-accent/20',
    'In review': 'bg-secondary/10 text-secondary ring-secondary/20',
    'Awaiting reply': 'bg-primary/10 text-primary ring-primary/20',
    Closed: 'bg-surface-muted text-muted-foreground ring-border',
};

function DetailRow({
    label,
    value,
    href,
}: {
    label: string;
    value: string;
    href?: string;
}) {
    if (!value.trim()) {
        return null;
    }

    return (
        <div className="inquiry-detail-row grid gap-1 border-b border-border/70 py-3 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
            <dt className="inquiry-detail-label text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </dt>
            <dd className="inquiry-detail-value text-sm font-medium text-foreground">
                {href ? (
                    <a
                        href={href}
                        className="break-all text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        {value}
                    </a>
                ) : (
                    <span className="break-words">{value}</span>
                )}
            </dd>
        </div>
    );
}

export function InquiryViewDialog({ open, inquiry, onClose }: InquiryViewDialogProps) {
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

    if (!open || !inquiry || typeof document === 'undefined') {
        return null;
    }

    const handlePrint = () => {
        document.body.classList.add('printing-inquiry');
        const cleanup = () => {
            document.body.classList.remove('printing-inquiry');
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
        window.setTimeout(cleanup, 1000);
    };

    const receivedLabel = inquiry.receivedAt || inquiry.received;

    return createPortal(
        <>
            <style>{`
                @media print {
                    body.printing-inquiry * {
                        visibility: hidden !important;
                    }
                    body.printing-inquiry .inquiry-print-root,
                    body.printing-inquiry .inquiry-print-root * {
                        visibility: visible !important;
                    }
                    body.printing-inquiry .inquiry-print-root {
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
                    body.printing-inquiry .inquiry-no-print {
                        display: none !important;
                    }
                    body.printing-inquiry .inquiry-print-sheet {
                        padding: 16mm 14mm !important;
                        background: #ffffff !important;
                        color: #0f172a !important;
                    }
                    body.printing-inquiry .inquiry-letterhead,
                    body.printing-inquiry .inquiry-section-divider,
                    body.printing-inquiry .inquiry-detail-row {
                        border-color: #cbd5e1 !important;
                    }
                    body.printing-inquiry .inquiry-print-status {
                        border: 1px solid #a1a1aa !important;
                        color: #18181b !important;
                        background: #ffffff !important;
                    }
                    body.printing-inquiry .inquiry-detail-label {
                        color: #64748b !important;
                    }
                    body.printing-inquiry .inquiry-detail-value,
                    body.printing-inquiry .inquiry-message-body {
                        color: #0f172a !important;
                    }
                    body.printing-inquiry a {
                        color: #0f172a !important;
                        text-decoration: none !important;
                    }
                }
            `}</style>

            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <button
                    type="button"
                    aria-label="Close dialog"
                    className="inquiry-no-print absolute inset-0 bg-brand-deep/65 backdrop-blur-[2px]"
                    onClick={onClose}
                />

                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    className="inquiry-print-root relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                >
                    <header className="inquiry-no-print flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                                Inquiry preview
                            </p>
                            <h2
                                id={titleId}
                                className="mt-1 font-heading text-lg font-semibold text-foreground sm:text-xl"
                            >
                                {inquiry.name}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">{inquiry.tour}</p>
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

                    <div className="inquiry-print-sheet min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                        <div className="inquiry-letterhead border-b border-border pb-6">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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

                                <div className="min-w-[12rem] text-start sm:text-end">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                                        {inquiry.isSeasonalPackage
                                            ? 'Seasonal package request'
                                            : 'Traveler inquiry'}
                                    </p>
                                    <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                                        #{inquiry.id}
                                    </p>
                                    <dl className="mt-4 space-y-2 text-sm">
                                        <div className="flex justify-between gap-4 sm:justify-end">
                                            <dt className="text-muted-foreground">Subject</dt>
                                            <dd className="max-w-[12rem] text-end font-medium text-foreground">
                                                {inquiry.tour}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between gap-4 sm:justify-end">
                                            <dt className="text-muted-foreground">Received</dt>
                                            <dd className="font-medium text-foreground">
                                                {receivedLabel}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between gap-4 sm:justify-end">
                                            <dt className="text-muted-foreground">Source</dt>
                                            <dd className="font-medium text-foreground">
                                                {inquiry.source}
                                            </dd>
                                        </div>
                                    </dl>
                                    <span
                                        className={cn(
                                            'inquiry-print-status mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                            statusStyles[inquiry.status],
                                        )}
                                    >
                                        {inquiry.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-10 sm:grid-cols-2">
                            <section>
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Traveler
                                </h3>
                                <dl className="inquiry-section-divider mt-3 border-t border-border">
                                    <DetailRow label="Full name" value={inquiry.name} />
                                    <DetailRow
                                        label="Email"
                                        value={inquiry.email}
                                        href={`mailto:${inquiry.email}`}
                                    />
                                    <DetailRow
                                        label="Phone"
                                        value={inquiry.phone ?? ''}
                                        href={
                                            inquiry.phone
                                                ? `tel:${inquiry.phone.replace(/\s+/g, '')}`
                                                : undefined
                                        }
                                    />
                                    <DetailRow
                                        label="Nationality"
                                        value={inquiry.nationality ?? ''}
                                    />
                                </dl>
                            </section>

                            <section>
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    {inquiry.isSeasonalPackage ? 'Seasonal package' : 'Trip request'}
                                </h3>
                                <dl className="inquiry-section-divider mt-3 border-t border-border">
                                    <DetailRow
                                        label={inquiry.isSeasonalPackage ? 'Package title' : 'Subject'}
                                        value={inquiry.tour}
                                    />
                                    {inquiry.isSeasonalPackage ? (
                                        <DetailRow
                                            label="Package price"
                                            value={inquiry.packagePrice || 'Not listed'}
                                        />
                                    ) : null}
                                    <DetailRow
                                        label="Request type"
                                        value={
                                            inquiry.isSeasonalPackage
                                                ? 'Seasonal package (not a custom tour)'
                                                : inquiry.source
                                        }
                                    />
                                    <DetailRow
                                        label="Preferred dates"
                                        value={inquiry.preferredDate ?? ''}
                                    />
                                    <DetailRow
                                        label="Group size"
                                        value={inquiry.travelerCount ?? ''}
                                    />
                                    <DetailRow label="Received" value={receivedLabel} />
                                </dl>
                            </section>
                        </div>

                        <section className="inquiry-section-divider mt-10 border-t border-border pt-6">
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Message
                            </h3>
                            {inquiry.message.trim() ? (
                                <p className="inquiry-message-body mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
                                    {inquiry.message}
                                </p>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No additional message was provided with this inquiry.
                                </p>
                            )}
                        </section>

                        <p className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                            {inquiry.isSeasonalPackage
                                ? 'This is a seasonal package request from the website. It is not a Custom Tour booking and does not reserve a place until confirmed in writing.'
                                : 'This record confirms that an inquiry was submitted through the website. It does not reserve a seat, confirm a trip, or constitute a booking confirmation.'}
                        </p>
                    </div>
                </section>
            </div>
        </>,
        document.body,
    );
}
