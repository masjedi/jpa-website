import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useSiteSettings } from '@/hooks/use-site-settings';
import type { AdminBookingDetail } from '@/types/adminBooking';

export const BOOKING_PRINT_STYLES = `
    .booking-print-only {
        position: absolute;
        width: 0;
        height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
    }
    @media print {
        body.printing-booking * {
            visibility: hidden !important;
        }
        body.printing-booking .booking-print-root,
        body.printing-booking .booking-print-root * {
            visibility: visible !important;
        }
        body.printing-booking .booking-print-root {
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
            opacity: 1 !important;
            z-index: 2147483647 !important;
        }
        body.printing-booking .booking-no-print {
            display: none !important;
        }
        body.printing-booking .booking-print-only {
            display: block !important;
            position: static !important;
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        body.printing-booking .booking-print-sheet {
            padding: 14mm 12mm !important;
            background: #ffffff !important;
            color: #0f172a !important;
        }
        body.printing-booking .booking-letterhead,
        body.printing-booking .booking-section-divider,
        body.printing-booking .booking-detail-row {
            border-color: #cbd5e1 !important;
        }
        body.printing-booking .booking-print-status {
            border: 1px solid #a1a1aa !important;
            color: #18181b !important;
            background: #ffffff !important;
        }
        body.printing-booking .booking-detail-label {
            color: #64748b !important;
        }
        body.printing-booking .booking-detail-value {
            color: #0f172a !important;
        }
        body.printing-booking .booking-print-section {
            break-inside: avoid;
        }
        body.printing-booking a {
            color: #0f172a !important;
            text-decoration: none !important;
        }
    }
`;

export function startBookingPrint(): void {
    const root = document.querySelector('.booking-print-root');
    const images = root ? Array.from(root.querySelectorAll('img')) : [];

    const waitForImages = Promise.all(
        images.map((image) => {
            if (image.complete) {
                return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener('error', () => resolve(), { once: true });
            });
        }),
    );

    void waitForImages.then(() => {
        document.body.classList.add('printing-booking');
        const cleanup = () => {
            document.body.classList.remove('printing-booking');
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
        window.setTimeout(cleanup, 1500);
    });
}

export async function fetchAdminBooking(id: number): Promise<AdminBookingDetail> {
    const response = await fetch(`/admin/bookings/${id}`, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!response.ok) {
        throw new Error('Could not load this booking request.');
    }

    const payload = (await response.json()) as { booking?: AdminBookingDetail };

    if (!payload.booking) {
        throw new Error('Could not load this booking request.');
    }

    return payload.booking;
}

function hasValue(value: string | number | boolean | null | undefined): boolean {
    return !(value === null || value === undefined || value === '' || value === false);
}

function display(value: string | number | boolean | null | undefined): string {
    if (value === true) {
        return 'Yes';
    }

    if (value === false || value === null || value === undefined || value === '') {
        return '';
    }

    return String(value);
}

function PrintRow({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
    if (!hasValue(value)) {
        return null;
    }

    return (
        <div className="booking-detail-row grid gap-1 border-b border-border/70 py-2.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
            <dt className="booking-detail-label text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </dt>
            <dd className="booking-detail-value text-sm font-medium text-foreground">{display(value)}</dd>
        </div>
    );
}

function PrintSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="booking-print-section booking-section-divider mt-8 border-t border-border pt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {title}
            </h3>
            <dl className="mt-3">{children}</dl>
        </section>
    );
}

export function BookingPrintDocument({ booking }: { booking: AdminBookingDetail }) {
    const { brandName, contactEmail, officeLocation, whatsappDisplay, logoColor } = useSiteSettings();
    const attachments = booking.attachments ?? [];
    const destinations = booking.recommendDestinations
        ? booking.destinations.length > 0
            ? `${booking.destinations.join(', ')} · Recommend destinations`
            : 'Recommend destinations'
        : booking.destinations.join(', ');
    const dietary = booking.dietaryDetails
        ? [booking.dietary, booking.dietaryDetails].filter(Boolean).join(' · ')
        : booking.dietary;

    return (
        <div className="booking-print-sheet">
            <div className="booking-letterhead border-b border-border pb-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <img
                            src={logoColor}
                            alt={brandName}
                            width={320}
                            height={72}
                            className="h-11 w-auto object-contain object-left"
                        />
                        <p className="mt-4 max-w-xs text-sm font-medium text-foreground">{brandName}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{officeLocation}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{contactEmail}</p>
                        <p className="text-sm text-muted-foreground">WhatsApp {whatsappDisplay}</p>
                    </div>

                    <div className="min-w-[13rem] text-start sm:text-end">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                            Custom tour request
                        </p>
                        <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                            {booking.reference}
                        </p>
                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between gap-4 sm:justify-end">
                                <dt className="text-muted-foreground">Received</dt>
                                <dd className="font-medium text-foreground">{booking.receivedAt || '—'}</dd>
                            </div>
                            <div className="flex justify-between gap-4 sm:justify-end">
                                <dt className="text-muted-foreground">Tourists</dt>
                                <dd className="font-medium text-foreground">{booking.travelerCount}</dd>
                            </div>
                            <div className="flex justify-between gap-4 sm:justify-end">
                                <dt className="text-muted-foreground">Primary</dt>
                                <dd className="font-medium text-foreground">{booking.travelerName || '—'}</dd>
                            </div>
                        </dl>
                        <span className="booking-print-status mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-border">
                            {booking.status}
                        </span>
                    </div>
                </div>
            </div>

            <PrintSection title="Trip preferences">
                <PrintRow label="Preferred dates" value={booking.preferredDate} />
                <PrintRow label="I am not sure yet" value={booking.flexibility} />
                <PrintRow label="Season" value={booking.season} />
                <PrintRow
                    label="Duration"
                    value={booking.durationDays > 0 ? `${booking.durationDays} days` : 'To be decided'}
                />
                <PrintRow label="Destinations" value={destinations} />
                <PrintRow label="Tour interests" value={booking.interests.join(', ')} />
                <PrintRow label="Route" value={booking.routePreference} />
            </PrintSection>

            <PrintSection title="Tourists">
                <PrintRow label="Group type" value={booking.groupType} />
                <PrintRow label="Number of tourists" value={booking.travelerCount} />
                {booking.travelers.map((traveler, index) => (
                    <div key={traveler.id} className="border-b border-border/70 py-3 last:border-b-0">
                        <p className="text-sm font-semibold text-foreground">
                            {traveler.isPrimary ? 'Tourist 1' : `Tourist ${index + 1}`}: {traveler.name}
                        </p>
                        <dl className="mt-2">
                            <PrintRow label="Email" value={traveler.email} />
                            <PrintRow label="Phone" value={traveler.phone} />
                            <PrintRow label="Date of birth" value={traveler.dateOfBirth} />
                            <PrintRow label="Nationality" value={traveler.nationality} />
                            <PrintRow label="Country of residence" value={traveler.countryOfResidence} />
                            <PrintRow label="Is it first your visit?" value={traveler.isFirstVisit} />
                        </dl>
                    </div>
                ))}
            </PrintSection>

            <PrintSection title="Services">
                <PrintRow label="Number of guides" value={booking.guideCount} />
                <PrintRow label="Languages" value={booking.guideLanguages} />
                <PrintRow label="Male and female" value={booking.guideGender} />
                <PrintRow label="Type of Vehicle" value={booking.vehicle} />
                <PrintRow label="Transportation Coverage" value={booking.transportCoverage} />
                <PrintRow label="Airport Pickup / drop-off" value={booking.airportPickup} />
                <PrintRow label="Domestic Transportation" value={booking.domesticPreference} />
                <PrintRow label="Accommodation Level" value={booking.accommodationLevel} />
                <PrintRow label="Room type" value={booking.roomPreference} />
                <PrintRow label="Number of rooms" value={booking.roomCount} />
            </PrintSection>

            <PrintSection title="Passport Information">
                {booking.documents.map((document, index) => (
                    <PrintRow
                        key={`${document.issuingCountry}-${index}`}
                        label={index === 0 ? 'Primary passport' : `Traveler ${index + 1} passport`}
                        value={`${document.issuingCountry || 'Country not provided'} · expiry ${document.expiryDate || '—'}`}
                    />
                ))}
                <PrintRow label="Visa status" value={booking.visaStatus} />
            </PrintSection>

            <PrintSection title="Emergency Contact">
                <PrintRow
                    label="Emergency contact"
                    value={
                        booking.emergencyName
                            ? `${booking.emergencyName} (${booking.emergencyRelationship}) · ${booking.emergencyPhone}`
                            : ''
                    }
                />
                <PrintRow label="Dietary requirement" value={dietary} />
                <PrintRow
                    label="Do you have any medical accessibility requirement?"
                    value={booking.medical}
                />
                <PrintRow label="Preferred contact method" value={booking.contactMethod} />
            </PrintSection>

            {attachments.length > 0 ? (
                <PrintSection title="Customer files">
                    {attachments.map((attachment) => (
                        <PrintRow
                            key={attachment.id}
                            label={attachment.name}
                            value={`${attachment.sizeLabel} · ${attachment.uploadedBy} · ${attachment.uploadedAt}`}
                        />
                    ))}
                </PrintSection>
            ) : null}

            {booking.history.length > 0 ? (
                <PrintSection title="Workflow">
                    {booking.history.map((item) => (
                        <PrintRow
                            key={`${item.at}-${item.to}`}
                            label={item.at}
                            value={`${item.from ? `${item.from} → ` : ''}${item.to} · ${item.by}`}
                        />
                    ))}
                </PrintSection>
            ) : null}

            <p className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                This record confirms that a custom tour request was submitted through the website. It does
                not reserve a seat, confirm a trip, or constitute a booking confirmation.
            </p>
        </div>
    );
}

export function BookingPrintHost({
    booking,
    onDone,
}: {
    booking: AdminBookingDetail | null;
    onDone: () => void;
}) {
    useEffect(() => {
        if (!booking) {
            return;
        }

        let finished = false;
        const finish = () => {
            if (finished) {
                return;
            }
            finished = true;
            onDone();
        };

        const start = window.setTimeout(() => startBookingPrint(), 50);
        window.addEventListener('afterprint', finish);
        const timeout = window.setTimeout(finish, 60_000);

        return () => {
            window.removeEventListener('afterprint', finish);
            window.clearTimeout(start);
            window.clearTimeout(timeout);
        };
    }, [booking, onDone]);

    if (!booking || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <>
            <style>{BOOKING_PRINT_STYLES}</style>
            <div className="booking-print-root pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-0">
                <BookingPrintDocument booking={booking} />
            </div>
        </>,
        document.body,
    );
}
