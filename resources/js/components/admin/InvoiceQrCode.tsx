import { QRCodeSVG } from 'qrcode.react';

interface InvoiceQrCodeProps {
    url: string;
    expiresLabel: string;
    active: boolean;
}

export function InvoiceQrCode({ url, expiresLabel, active }: InvoiceQrCodeProps) {
    if (!url) {
        return null;
    }

    return (
        <div className="invoice-qr-panel flex flex-col items-center text-center sm:px-4">
            <div className="rounded-xl border border-border bg-white p-2.5 shadow-sm">
                <QRCodeSVG
                    value={url}
                    size={112}
                    level="M"
                    includeMargin={false}
                    aria-label="Invoice verification QR code"
                />
            </div>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Scan to verify
            </p>
            <p className="mt-1 max-w-[10rem] text-[10px] leading-snug text-muted-foreground">
                {active
                    ? `Active until ${expiresLabel}`
                    : `Verification expired on ${expiresLabel}`}
            </p>
        </div>
    );
}
