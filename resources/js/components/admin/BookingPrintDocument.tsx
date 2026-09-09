import type { ReactNode } from 'react';

export interface AdminBookingDetail {
    id: number;
    reference: string;
    status: string;
    statusValue: string;
    requestKind?: string;
    requestKindLabel?: string;
    isSeasonalPackage?: boolean;
    packageTitle?: string;
    packagePrice?: string;
    fullName: string;
    email: string;
    phone: string;
    passportNumber: string;
    country: string;
    tourType: string;
    tourTypeValue: string;
    numberOfTourists: number;
    touristGenders: string[];
    touristGendersLabel: string;
    guidePreference: string;
    guidePreferenceLabel: string;
    preferredDate: string;
    preferredDateStart: string;
    preferredDateEnd: string;
    alternativeDate: string;
    preferredDestinations: string;
    otherRequests: string;
    submitted: string;
    nextStatus: string | null;
    nextStatusLabel: string | null;
}

interface BookingPrintDocumentProps {
    booking: AdminBookingDetail;
}

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function buildBookingPrintHtml(booking: AdminBookingDetail): string {
    const row = (label: string, value: string) =>
        `<div class="row"><span class="label">${escapeHtml(label)}</span><span class="value">${escapeHtml(value || '—')}</span></div>`;

    const section = (title: string, rows: string) =>
        `<section><h2>${escapeHtml(title)}</h2>${rows}</section>`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Tour Request ${escapeHtml(booking.reference)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      color: #1a2430;
      font-family: Georgia, "Times New Roman", serif;
      line-height: 1.5;
      background: #fff;
    }
    h1 {
      margin: 0 0 8px;
      text-align: center;
      color: #163B5C;
      font-size: 28px;
      font-weight: 600;
    }
    .meta {
      margin: 0 0 28px;
      text-align: center;
      color: #4b5563;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
    }
    section {
      margin: 0 0 20px;
      padding: 0 0 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    section:last-of-type { border-bottom: 0; }
    h2 {
      margin: 0 0 12px;
      color: #163B5C;
      font-size: 16px;
      font-weight: 700;
      font-family: Arial, Helvetica, sans-serif;
    }
    .row {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 12px;
      margin: 0 0 8px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
    }
    .label { color: #6b7280; font-weight: 600; }
    .value { color: #111827; }
    @media print {
      body { padding: 12mm; }
    }
  </style>
</head>
<body>
  <h1>Tour Request Form</h1>
  <p class="meta"><strong>Reference:</strong> ${escapeHtml(booking.reference)} · <strong>Status:</strong> ${escapeHtml(booking.status)} · <strong>Submitted:</strong> ${escapeHtml(booking.submitted)}</p>
  ${
      booking.isSeasonalPackage
          ? section(
                'Seasonal Package',
                [
                    row('Request type', 'Seasonal package (not a custom tour)'),
                    row('Package title', booking.packageTitle || '—'),
                    row('Package price', booking.packagePrice || 'Not listed'),
                ].join(''),
            )
          : section('Request type', row('Type', 'Custom tour request'))
  }
  ${section(
      '1. Personal Details',
      [
          row('Full Name', booking.fullName),
          row('Email', booking.email),
          row('Phone Number', booking.phone),
          row('Passport Number', booking.passportNumber),
          row('Country', booking.country),
      ].join(''),
  )}
  ${section(
      '2. Tour Details',
      [
          row('Tour Type', booking.tourType),
          row('Number of Tourists', String(booking.numberOfTourists)),
          row('Tourists', booking.touristGendersLabel),
      ].join(''),
  )}
  ${section('3. Tour Guide', row('Guide Preference', booking.guidePreferenceLabel))}
  ${section(
      '4. Dates',
      [
          row('Preferred Date', booking.preferredDate),
          row('Alternative/Available Date', booking.alternativeDate || '—'),
      ].join(''),
  )}
  ${section('5. Destinations', row('Preferred destination(s)', booking.preferredDestinations))}
  ${section('6. Other Requests', row('Special requirements', booking.otherRequests || '—'))}
</body>
</html>`;
}

/** Kept for optional on-screen preview; print uses buildBookingPrintHtml. */
export function BookingPrintDocument({ booking }: BookingPrintDocumentProps) {
    return (
        <div className="booking-print-sheet bg-white p-8 text-black">
            <h1 className="mb-6 text-center text-2xl font-semibold text-[#163B5C]">
                {booking.isSeasonalPackage ? 'Seasonal Package Request' : 'Tour Request Form'}
            </h1>
            <p className="mb-6 text-sm">
                <strong>Reference:</strong> {booking.reference} · <strong>Status:</strong> {booking.status}
            </p>
            {booking.isSeasonalPackage ? (
                <PrintSection title="Seasonal Package">
                    <PrintRow label="Request type" value="Seasonal package (not a custom tour)" />
                    <PrintRow label="Package title" value={booking.packageTitle || '—'} />
                    <PrintRow label="Package price" value={booking.packagePrice || 'Not listed'} />
                </PrintSection>
            ) : (
                <PrintSection title="Request type">
                    <PrintRow label="Type" value="Custom tour request" />
                </PrintSection>
            )}
            <PrintSection title="1. Personal Details">
                <PrintRow label="Full Name" value={booking.fullName} />
                <PrintRow label="Email" value={booking.email} />
                <PrintRow label="Phone Number" value={booking.phone} />
                <PrintRow label="Passport Number" value={booking.passportNumber} />
                <PrintRow label="Country" value={booking.country} />
            </PrintSection>
            <PrintSection title="2. Tour Details">
                <PrintRow label="Tour Type" value={booking.tourType} />
                <PrintRow label="Number of Tourists" value={String(booking.numberOfTourists)} />
                <PrintRow label="Tourists" value={booking.touristGendersLabel} />
            </PrintSection>
            <PrintSection title="3. Tour Guide">
                <PrintRow label="Guide Preference" value={booking.guidePreferenceLabel} />
            </PrintSection>
            <PrintSection title="4. Dates">
                <PrintRow label="Preferred Date" value={booking.preferredDate} />
                <PrintRow label="Alternative/Available Date" value={booking.alternativeDate || '—'} />
            </PrintSection>
            <PrintSection title="5. Destinations">
                <PrintRow label="Preferred destination(s)" value={booking.preferredDestinations} />
            </PrintSection>
            <PrintSection title="6. Other Requests">
                <PrintRow label="Special requirements" value={booking.otherRequests || '—'} />
            </PrintSection>
        </div>
    );
}

function PrintSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="mb-5 border-b border-slate-200 pb-4">
            <h2 className="mb-3 text-lg font-semibold text-[#163B5C]">{title}</h2>
            <div className="space-y-2">{children}</div>
        </section>
    );
}

function PrintRow({ label, value }: { label: string; value: string }) {
    return (
        <p className="text-sm">
            <span className="font-medium text-slate-600">{label}: </span>
            <span>{value}</span>
        </p>
    );
}

export function startBookingPrint(booking: AdminBookingDetail): void {
    const printWindow = window.open('', '_blank', 'width=900,height=1000');

    if (!printWindow) {
        window.alert('Please allow pop-ups to print this tour request.');
        return;
    }

    printWindow.document.open();
    printWindow.document.write(buildBookingPrintHtml(booking));
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
        printWindow.print();
    }, 250);
}

export async function fetchAdminBooking(id: number): Promise<AdminBookingDetail> {
    const response = await fetch(`/admin/bookings/${id}`, {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error('Unable to load booking.');
    }

    const payload = (await response.json()) as { booking: AdminBookingDetail };

    return payload.booking;
}
