import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ClipboardList, Download, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import { FileUploadField, type SelectedUploadFile } from '@/components/admin/FileUploadField';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { mediaProfiles } from '@/lib/mediaProfiles';
import type { SharedPageProps } from '@/types/inertia';

interface BookingDetail {
    id: number;
    reference: string;
    status: string;
    travelerName: string;
    email: string;
    preferredDate: string;
    travelerCount: number;
    receivedAt: string;
    adults: number;
    children: number;
    groupType: string;
    flexibility: string;
    season: string;
    durationDays: number;
    otherDestination: string;
    recommendDestinations: boolean;
    routePreference: string;
    destinations: string[];
    interests: string[];
    visaStatus: string;
    insuranceStatus: string;
    emergencyName: string;
    emergencyRelationship: string;
    emergencyPhone: string;
    dietary: string;
    dietaryDetails: string;
    medical: string;
    medicalDetails: string;
    contactMethod: string;
    specialRequests: string;
    wantsComplete: boolean;
    wantsGuide: boolean;
    guideGender: string;
    wantsTransportation: boolean;
    wantsAccommodation: boolean;
    wantsAirport: boolean;
    wantsDomestic: boolean;
    guideLanguage: string;
    guideLanguageOther: string;
    guideRequest: string;
    vehicle: string;
    transportCoverage: string;
    transportNotes: string;
    accommodationLevel: string;
    roomPreference: string;
    roomCount: number | null;
    accommodationNotes: string;
    arrivalAssistance: string;
    arrivalDetailsLater: boolean;
    arrivalAirport: string;
    arrivalDate: string;
    arrivalTime: string;
    arrivalFlight: string;
    departureAssistance: string;
    departureDetailsLater: boolean;
    departureAirport: string;
    departureDate: string;
    departureTime: string;
    departureFlight: string;
    domesticPreference: string;
    travelers: {
        id: number;
        isPrimary: boolean;
        name: string;
        dateOfBirth: string;
        nationality: string;
        email: string;
        phone: string;
        countryOfResidence: string;
    }[];
    documents: { issuingCountry: string; expiryDate: string }[];
    attachments?: {
        id: number;
        name: string;
        sizeLabel: string;
        uploadedBy: string;
        uploadedAt: string;
        downloadUrl: string;
    }[];
    history: { from: string | null; to: string; by: string; at: string }[];
    nextStatus: string | null;
    nextStatusLabel: string | null;
}

interface BookingDetailPageProps extends SharedPageProps {
    booking: BookingDetail;
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
            <div className="space-y-4">
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
                        <Link
                            href="/admin/bookings"
                            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
                        >
                            Back to list
                        </Link>
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
                    <Row label="Preferred date" value={booking.preferredDate} />
                    <Row label="Flexibility" value={booking.flexibility} />
                    <Row label="Season" value={booking.season} />
                    <Row label="Duration" value={`${booking.durationDays} days`} />
                    <Row label="Destinations" value={booking.destinations.join(', ')} />
                    <Row label="Other destination" value={booking.otherDestination} />
                    <Row label="Recommend destinations" value={booking.recommendDestinations} />
                    <Row label="Interests" value={booking.interests.join(', ')} />
                    <Row label="Route" value={booking.routePreference} />
                </Section>

                <Section title="Travelers">
                    <Row label="Count" value={`${booking.travelerCount} (${booking.adults} adults, ${booking.children} children)`} />
                    <Row label="Group type" value={booking.groupType} />
                    {booking.travelers.map((traveler) => (
                        <div key={traveler.id} className="border-b border-border/70 py-3 last:border-b-0">
                            <p className="text-sm font-medium text-foreground">
                                {traveler.name}
                                {traveler.isPrimary ? ' · Primary' : ''}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {[traveler.nationality, traveler.dateOfBirth, traveler.email, traveler.phone, traveler.countryOfResidence]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </p>
                        </div>
                    ))}
                </Section>

                <Section title="Services">
                    <Row label="Complete package" value={booking.wantsComplete} />
                    <Row label="Guide" value={booking.wantsGuide} />
                    <Row label="Preferred guide" value={booking.guideGender} />
                    <Row label="Guide language" value={booking.guideLanguageOther || booking.guideLanguage} />
                    <Row label="Guide notes" value={booking.guideRequest} />
                    <Row label="Transportation" value={booking.wantsTransportation} />
                    <Row label="Vehicle" value={booking.vehicle} />
                    <Row label="Transport coverage" value={booking.transportCoverage} />
                    <Row label="Transport notes" value={booking.transportNotes} />
                    <Row label="Accommodation" value={booking.wantsAccommodation} />
                    <Row label="Level" value={booking.accommodationLevel} />
                    <Row
                        label="Rooms"
                        value={
                            booking.roomCount
                                ? `${booking.roomCount} × ${booking.roomPreference}`
                                : booking.roomPreference
                        }
                    />
                    <Row label="Accommodation notes" value={booking.accommodationNotes} />
                    <Row label="Airport assistance" value={booking.wantsAirport} />
                    <Row label="Arrival" value={booking.arrivalAssistance} />
                    <Row label="Arrival later" value={booking.arrivalDetailsLater} />
                    <Row
                        label="Arrival details"
                        value={[booking.arrivalAirport, booking.arrivalDate, booking.arrivalTime, booking.arrivalFlight]
                            .filter(Boolean)
                            .join(' · ')}
                    />
                    <Row label="Departure" value={booking.departureAssistance} />
                    <Row
                        label="Departure details"
                        value={[booking.departureAirport, booking.departureDate, booking.departureTime, booking.departureFlight]
                            .filter(Boolean)
                            .join(' · ')}
                    />
                    <Row label="Domestic travel" value={booking.domesticPreference} />
                </Section>

                <Section title="Travel documents">
                    {booking.documents.map((document, index) => (
                        <Row
                            key={`${document.issuingCountry}-${index}`}
                            label={index === 0 ? 'Primary passport' : `Traveler ${index + 1} passport`}
                            value={`${document.issuingCountry} · expiry ${document.expiryDate}`}
                        />
                    ))}
                    <Row label="Visa" value={booking.visaStatus} />
                    <Row label="Insurance" value={booking.insuranceStatus} />
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

                <Section title="Requirements">
                    <Row
                        label="Emergency contact"
                        value={`${booking.emergencyName} (${booking.emergencyRelationship}) · ${booking.emergencyPhone}`}
                    />
                    <Row label="Dietary" value={booking.dietaryDetails || booking.dietary} />
                    <Row label="Medical / accessibility" value={booking.medicalDetails || booking.medical} />
                    <Row label="Preferred contact" value={booking.contactMethod} />
                    <Row label="Special requests" value={booking.specialRequests} />
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
        </>
    );
}

BookingDetail.layout = withAdminLayout('Custom booking');
