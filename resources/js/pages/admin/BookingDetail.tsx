import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ClipboardList, Download, Printer, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import {
    BOOKING_PRINT_STYLES,
    BookingPrintDocument,
    startBookingPrint,
} from '@/components/admin/BookingPrintDocument';
import { FileUploadField, type SelectedUploadFile } from '@/components/admin/FileUploadField';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { mediaProfiles } from '@/lib/mediaProfiles';
import type { AdminBookingDetail } from '@/types/adminBooking';
import type { SharedPageProps } from '@/types/inertia';

interface BookingDetailPageProps extends SharedPageProps {
    booking: AdminBookingDetail;
    attachmentUpload?: {
        hint: string;
        accept: string;
        max_files: number;
        max_upload_kilobytes: number;
    };
}

function Row({ label, value }: { label: string; value?: string | number | boolean | null }) {
    if (value === null || value === undefined || value === '' || value === false) {
        return null;
    }

    const display = typeof value === 'boolean' ? 'Yes' : String(value);

    return (
        <div className="grid gap-1 border-b border-border/70 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm text-foreground">{display}</dd>
        </div>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
            <dl className="mt-3">{children}</dl>
        </section>
    );
}

export default function BookingDetail() {
    const { booking, attachmentUpload, flash } = usePage<BookingDetailPageProps>().props;
    const statusForm = useForm({ status: booking.nextStatus ?? '' });
    const [pendingFiles, setPendingFiles] = useState<SelectedUploadFile[]>([]);
    const [attaching, setAttaching] = useState(false);
    const [uploadError, setUploadError] = useState<string | undefined>();
    const attachments = booking.attachments ?? [];
    const uploadSpec = attachmentUpload ?? {
        hint: mediaProfiles.document_attachment.hint,
        accept: mediaProfiles.document_attachment.accept,
        max_files: mediaProfiles.document_attachment.maxFiles,
        max_upload_kilobytes: mediaProfiles.document_attachment.maxUploadKilobytes,
    };

    const submitAttachments = () => {
        if (pendingFiles.length === 0) {
            return;
        }

        const formData = new FormData();

        for (const item of pendingFiles) {
            formData.append('attachments[]', item.file);
        }

        setAttaching(true);
        setUploadError(undefined);

        router.post(`/admin/bookings/${booking.id}/attachments`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setPendingFiles([]),
            onError: (submitErrors) => {
                const message =
                    submitErrors.attachments ??
                    Object.values(submitErrors).find((value) => Boolean(value));

                setUploadError(message || 'Could not attach files. Check the file type and size.');
            },
            onFinish: () => setAttaching(false),
        });
    };

    return (
        <>
            <style>{BOOKING_PRINT_STYLES}</style>
            <div className="booking-print-root space-y-4">
                <div className="booking-print-only">
                    <BookingPrintDocument booking={booking} />
                </div>
                <div className="booking-no-print space-y-4">
                {flash.success ? (
                    <div
                        role="status"
                        className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                    >
                        {flash.success}
                    </div>
                ) : null}

                <AdminSectionHeader
                    eyebrow="Custom bookings"
                    title={booking.reference}
                    description={`${booking.travelerName} · ${booking.status} · inquiry only, not a confirmed reservation.`}
                    icon={ClipboardList}
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={startBookingPrint}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
                            >
                                <Printer className="size-4" aria-hidden />
                                Print
                            </button>
                            <Link
                                href="/admin/bookings"
                                className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
                            >
                                Back to list
                            </Link>
                        </div>
                    }
                />

                {booking.nextStatus ? (
                    <form
                        className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end"
                        onSubmit={(event) => {
                            event.preventDefault();
                            statusForm.patch(`/admin/bookings/${booking.id}/status`);
                        }}
                    >
                        <label className="min-w-0 flex-1 text-xs font-medium text-muted-foreground">
                            Move to next status
                            <select
                                value={statusForm.data.status}
                                onChange={(event) => statusForm.setData('status', event.target.value)}
                                className={`${adminFieldClass} mt-1.5`}
                            >
                                <option value={booking.nextStatus}>{booking.nextStatusLabel}</option>
                            </select>
                        </label>
                        <button
                            type="submit"
                            disabled={statusForm.processing || !statusForm.data.status}
                            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                        >
                            {statusForm.processing ? 'Updating…' : 'Update status'}
                        </button>
                    </form>
                ) : null}

                <Section title="Trip preferences">
                    <Row label="Preferred dates" value={booking.preferredDate} />
                    <Row label="I am not sure yet" value={booking.flexibility} />
                    <Row label="Season" value={booking.season} />
                    <Row
                        label="Duration"
                        value={booking.durationDays > 0 ? `${booking.durationDays} days` : 'To be decided'}
                    />
                    <Row
                        label="Destinations"
                        value={
                            booking.recommendDestinations
                                ? booking.destinations.length > 0
                                    ? `${booking.destinations.join(', ')} · Recommend destinations`
                                    : 'Recommend destinations'
                                : booking.destinations.join(', ')
                        }
                    />
                    <Row label="Tour interests" value={booking.interests.join(', ')} />
                    <Row label="Route" value={booking.routePreference} />
                </Section>

                <Section title="Tourists">
                    <Row label="Group type" value={booking.groupType} />
                    <Row label="Number of tourists" value={booking.travelerCount} />
                    {booking.travelers.map((traveler, index) => (
                        <div key={traveler.id} className="border-b border-border/70 py-3 last:border-b-0">
                            <p className="text-sm font-medium text-foreground">
                                {traveler.isPrimary ? 'Tourist 1' : `Tourist ${index + 1}`}: {traveler.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {[
                                    traveler.email,
                                    traveler.phone,
                                    traveler.dateOfBirth,
                                    traveler.nationality,
                                    traveler.countryOfResidence,
                                    traveler.isFirstVisit ? `First visit: ${traveler.isFirstVisit}` : '',
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </p>
                        </div>
                    ))}
                </Section>

                <Section title="Services">
                    <Row label="Number of guides" value={booking.guideCount} />
                    <Row label="Languages" value={booking.guideLanguages} />
                    <Row label="Male and female" value={booking.guideGender} />
                    <Row label="Type of Vehicle" value={booking.vehicle} />
                    <Row label="Transportation Coverage" value={booking.transportCoverage} />
                    <Row label="Airport Pickup / drop-off" value={booking.airportPickup} />
                    <Row label="Domestic Transportation" value={booking.domesticPreference} />
                    <Row label="Accommodation Level" value={booking.accommodationLevel} />
                    <Row label="Room type" value={booking.roomPreference} />
                    <Row label="Number of rooms" value={booking.roomCount} />
                </Section>

                <Section title="Passport Information">
                    {booking.documents.map((document, index) => (
                        <Row
                            key={`${document.issuingCountry}-${index}`}
                            label={index === 0 ? 'Primary passport' : `Traveler ${index + 1} passport`}
                            value={`${document.issuingCountry} · expiry ${document.expiryDate}`}
                        />
                    ))}
                    <Row label="Visa status" value={booking.visaStatus} />
                </Section>

                <section className="rounded-xl border border-border bg-surface p-5">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Customer files
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Attach passports, itineraries, or other files for this request. Files stay in
                        the dashboard and are not published on the website.
                    </p>

                    {attachments.length > 0 ? (
                        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
                            {attachments.map((attachment) => (
                                <li
                                    key={attachment.id}
                                    className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {attachment.name}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {attachment.sizeLabel} · {attachment.uploadedBy} ·{' '}
                                            {attachment.uploadedAt}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={attachment.downloadUrl}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted"
                                        >
                                            <Download className="size-3.5" aria-hidden />
                                            Download
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.delete(
                                                    `/admin/bookings/${booking.id}/attachments/${attachment.id}`,
                                                    { preserveScroll: true },
                                                );
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-surface-muted"
                                        >
                                            <Trash2 className="size-3.5" aria-hidden />
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">
                            No files attached yet.
                        </p>
                    )}

                    <div className="mt-4 space-y-3">
                        <FileUploadField
                            id="booking-attachments"
                            label="Attach files"
                            files={pendingFiles}
                            onChange={setPendingFiles}
                            disabled={attaching}
                            error={uploadError}
                            hint={uploadSpec.hint}
                            accept={uploadSpec.accept}
                            maxFiles={uploadSpec.max_files}
                        />
                        <button
                            type="button"
                            disabled={attaching || pendingFiles.length === 0}
                            onClick={submitAttachments}
                            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                        >
                            {attaching ? 'Attaching…' : 'Save files to this request'}
                        </button>
                    </div>
                </section>

                <Section title="Emergency Contact">
                    <Row
                        label="Emergency contact"
                        value={`${booking.emergencyName} (${booking.emergencyRelationship}) · ${booking.emergencyPhone}`}
                    />
                    <Row
                        label="Dietary requirement"
                        value={
                            booking.dietaryDetails
                                ? [booking.dietary, booking.dietaryDetails].filter(Boolean).join(' · ')
                                : booking.dietary
                        }
                    />
                    <Row
                        label="Do you have any medical accessibility requirement?"
                        value={booking.medical}
                    />
                    <Row label="Preferred contact method" value={booking.contactMethod} />
                </Section>

                <Section title="Workflow">
                    {booking.history.map((item) => (
                        <Row
                            key={`${item.at}-${item.to}`}
                            label={item.at}
                            value={`${item.from ? `${item.from} → ` : ''}${item.to} · ${item.by}`}
                        />
                    ))}
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={() => router.delete(`/admin/bookings/${booking.id}`)}
                            className="text-sm font-medium text-destructive hover:underline"
                        >
                            Delete this request
                        </button>
                    </div>
                </Section>
                </div>
            </div>
        </>
    );
}

BookingDetail.layout = withAdminLayout('Custom booking');
