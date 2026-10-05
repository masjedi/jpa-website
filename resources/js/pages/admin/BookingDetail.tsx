import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Pencil, Printer, Trash2 } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import {
    startBookingPrint,
    type AdminBookingDetail,
} from '@/components/admin/BookingPrintDocument';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';

interface BookingDetailProps {
    booking: AdminBookingDetail;
}

const statusStyles: Record<string, string> = {
    Submitted: 'bg-accent/15 text-accent',
    'Under Review': 'bg-secondary/10 text-secondary',
    'Quotation Sent': 'bg-primary/10 text-primary',
    'Customer Accepted': 'bg-secondary/10 text-secondary',
    'Deposit Pending': 'bg-accent/15 text-accent',
    Confirmed: 'bg-primary/10 text-primary',
};

const actionButtonClass =
    'inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted';

function shouldOpenEditor(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return new URLSearchParams(window.location.search).get('edit') === '1';
}

export default function BookingDetail({ booking }: BookingDetailProps) {
    const { flash } = usePage().props;
    const [editing, setEditing] = useState(shouldOpenEditor);
    const form = useForm({
        full_name: booking.fullName ?? '',
        email: booking.email ?? '',
        phone: booking.phone ?? '',
        passport_number: booking.passportNumber ?? '',
        country: booking.country ?? '',
        tour_type: booking.tourTypeValue || 'group',
        number_of_tourists: String(booking.numberOfTourists ?? 1),
        tourist_genders: Array.isArray(booking.touristGenders) ? booking.touristGenders : [],
        guide_preference: booking.guidePreference || 'no_preference',
        preferred_date: booking.preferredDateStart ?? '',
        preferred_date_end: booking.preferredDateEnd ?? '',
        alternative_date: booking.alternativeDate ?? '',
        preferred_destinations: booking.preferredDestinations ?? '',
        other_requests: booking.otherRequests ?? '',
        status: booking.statusValue,
    });

    useEffect(() => {
        if (!shouldOpenEditor()) {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }, []);

    const fieldError = (key: string): string | undefined => {
        const value = form.errors[key];

        return typeof value === 'string' ? value : undefined;
    };

    const toggleGender = (gender: string) => {
        const current = form.data.tourist_genders;
        form.setData(
            'tourist_genders',
            current.includes(gender)
                ? current.filter((value) => value !== gender)
                : [...current, gender],
        );
    };

    return (
        <div className="space-y-5">
            {flash.success ? (
                <div
                    role="status"
                    className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                >
                    {flash.success}
                </div>
            ) : null}

            <AdminSectionHeader
                eyebrow={booking.isSeasonalPackage ? 'Seasonal package' : 'Custom tour'}
                title={booking.reference}
                description={
                    booking.isSeasonalPackage
                        ? `Seasonal package request${booking.packageTitle ? `: ${booking.packageTitle}` : ''}`
                        : 'Custom tour request form submission'
                }
                icon={ClipboardList}
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/bookings" className={actionButtonClass}>
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                        <button type="button" onClick={() => startBookingPrint(booking)} className={actionButtonClass}>
                            <Printer className="size-4" />
                            Print
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing((value) => !value)}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                        >
                            <Pencil className="size-4" />
                            {editing ? 'Cancel edit' : 'Edit'}
                        </button>
                    </div>
                }
            />

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 sm:px-5">
                <span
                    className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        statusStyles[booking.status] ?? 'bg-surface-muted text-muted-foreground',
                    )}
                >
                    {booking.status}
                </span>
                <p className="text-sm text-muted-foreground">
                    Submitted <span className="font-medium text-foreground">{booking.submitted}</span>
                </p>
                <div className="ms-auto flex flex-wrap gap-2">
                    {booking.nextStatus ? (
                        <button
                            type="button"
                            onClick={() =>
                                router.patch(`/admin/bookings/${booking.id}/status`, {
                                    status: booking.nextStatus,
                                })
                            }
                            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground"
                        >
                            Move to {booking.nextStatusLabel}
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Delete this tour request?')) {
                                router.delete(`/admin/bookings/${booking.id}`);
                            }
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </button>
                </div>
            </div>

            {editing ? (
                <AdminSectionPanel title="Edit tour request" description="Update the submitted Tour Request Form fields.">
                    <form
                        className="space-y-6"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.transform((data) => ({
                                ...data,
                                number_of_tourists: Number(data.number_of_tourists),
                            }));
                            form.patch(`/admin/bookings/${booking.id}`, {
                                preserveScroll: true,
                                onSuccess: () => setEditing(false),
                            });
                        }}
                    >
                        <EditSection title="1. Personal Details">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {(
                                    [
                                        ['full_name', 'Full Name', 20],
                                        ['email', 'Email', 50],
                                        ['phone', 'Phone', 20],
                                        ['passport_number', 'Passport Number', 20],
                                        ['country', 'Country', 15],
                                    ] as const
                                ).map(([key, label, max]) => (
                                    <AdminFormField
                                        key={key}
                                        id={key}
                                        label={label}
                                        error={fieldError(key)}
                                    >
                                        <input
                                            id={key}
                                            value={form.data[key]}
                                            maxLength={max}
                                            onChange={(event) => form.setData(key, event.target.value)}
                                            className={cn(adminFieldClass, fieldError(key) && adminFieldErrorClass)}
                                        />
                                    </AdminFormField>
                                ))}
                            </div>
                        </EditSection>

                        <EditSection title="2. Tour Details">
                            <div className="space-y-4">
                                <fieldset>
                                    <legend className="mb-2 text-sm font-medium text-foreground">Tour Type</legend>
                                    <div className="flex flex-wrap gap-4">
                                        {(['group', 'individual'] as const).map((type) => (
                                            <label key={type} className="inline-flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={form.data.tour_type === type}
                                                    onChange={() => form.setData('tour_type', type)}
                                                />
                                                {type === 'group' ? 'Group' : 'Individual'}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                <AdminFormField id="number_of_tourists" label="Number of tourists">
                                    <input
                                        id="number_of_tourists"
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={form.data.number_of_tourists}
                                        disabled={form.data.tour_type === 'individual'}
                                        onChange={(event) => form.setData('number_of_tourists', event.target.value)}
                                        className={cn(
                                            adminFieldClass,
                                            form.data.tour_type === 'individual' && 'opacity-60',
                                        )}
                                    />
                                </AdminFormField>
                                <fieldset>
                                    <legend className="mb-2 text-sm font-medium text-foreground">Tourists</legend>
                                    <div className="flex flex-wrap gap-4">
                                        {(['male', 'female'] as const).map((gender) => (
                                            <label key={gender} className="inline-flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={form.data.tourist_genders.includes(gender)}
                                                    onChange={() => toggleGender(gender)}
                                                />
                                                {gender === 'male' ? 'Male' : 'Female'}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                        </EditSection>

                        <EditSection title="3. Tour Guide">
                            <fieldset>
                                <legend className="mb-2 text-sm font-medium text-foreground">Guide Preference</legend>
                                <div className="flex flex-wrap gap-4">
                                    {(
                                        [
                                            ['male', 'Male'],
                                            ['female', 'Female'],
                                            ['no_preference', 'No Preference'],
                                        ] as const
                                    ).map(([value, label]) => (
                                        <label key={value} className="inline-flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={form.data.guide_preference === value}
                                                onChange={() => form.setData('guide_preference', value)}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </EditSection>

                        <EditSection title="4. Dates">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <AdminFormField id="preferred_date" label="Preferred start">
                                    <input
                                        id="preferred_date"
                                        type="date"
                                        value={form.data.preferred_date}
                                        onChange={(event) => form.setData('preferred_date', event.target.value)}
                                        className={adminFieldClass}
                                    />
                                </AdminFormField>
                                <AdminFormField id="preferred_date_end" label="Preferred end">
                                    <input
                                        id="preferred_date_end"
                                        type="date"
                                        value={form.data.preferred_date_end}
                                        min={form.data.preferred_date || undefined}
                                        onChange={(event) => form.setData('preferred_date_end', event.target.value)}
                                        className={adminFieldClass}
                                    />
                                </AdminFormField>
                                <AdminFormField id="alternative_date" label="Alternative date">
                                    <input
                                        id="alternative_date"
                                        type="date"
                                        value={form.data.alternative_date}
                                        onChange={(event) => form.setData('alternative_date', event.target.value)}
                                        className={adminFieldClass}
                                    />
                                </AdminFormField>
                            </div>
                        </EditSection>

                        <EditSection title="5. Destinations">
                            <AdminFormField
                                id="preferred_destinations"
                                label="Preferred destination(s)"
                                error={fieldError('preferred_destinations')}
                            >
                                <input
                                    id="preferred_destinations"
                                    value={form.data.preferred_destinations}
                                    maxLength={50}
                                    onChange={(event) =>
                                        form.setData('preferred_destinations', event.target.value)
                                    }
                                    className={cn(
                                        adminFieldClass,
                                        fieldError('preferred_destinations') && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>
                        </EditSection>

                        <EditSection title="6. Other Requests">
                            <AdminFormField
                                id="other_requests"
                                label="Special requirements"
                                error={fieldError('other_requests')}
                            >
                                <textarea
                                    id="other_requests"
                                    rows={4}
                                    maxLength={100}
                                    value={form.data.other_requests}
                                    onChange={(event) => form.setData('other_requests', event.target.value)}
                                    className={cn(
                                        adminFieldClass,
                                        fieldError('other_requests') && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>
                        </EditSection>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                        >
                            {form.processing ? 'Saving…' : 'Save changes'}
                        </button>
                    </form>
                </AdminSectionPanel>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {booking.isSeasonalPackage ? (
                        <DetailCard title="Seasonal Package">
                            <DetailRow label="Request type" value="Seasonal package (not a custom tour)" />
                            <DetailRow label="Package title" value={booking.packageTitle || '—'} />
                            <DetailRow label="Package price" value={booking.packagePrice || 'Not listed'} />
                        </DetailCard>
                    ) : (
                        <DetailCard title="Request type">
                            <DetailRow label="Type" value="Custom tour request" />
                        </DetailCard>
                    )}

                    <DetailCard title="1. Personal Details">
                        <DetailRow label="Full Name" value={booking.fullName} />
                        <DetailRow label="Email" value={booking.email} />
                        <DetailRow label="Phone Number" value={booking.phone} />
                        <DetailRow label="Passport Number" value={booking.passportNumber} />
                        <DetailRow label="Country" value={booking.country} />
                    </DetailCard>

                    <DetailCard title="2. Tour Details">
                        <DetailRow label="Tour Type" value={booking.tourType} />
                        <DetailRow label="Number of Tourists" value={String(booking.numberOfTourists)} />
                        <DetailRow label="Tourists" value={booking.touristGendersLabel || '—'} />
                    </DetailCard>

                    <DetailCard title="3. Tour Guide">
                        <DetailRow label="Guide Preference" value={booking.guidePreferenceLabel} />
                    </DetailCard>

                    <DetailCard title="4. Dates">
                        <DetailRow label="Preferred Date" value={booking.preferredDate || '—'} />
                        <DetailRow label="Alternative/Available Date" value={booking.alternativeDate || '—'} />
                    </DetailCard>

                    <DetailCard title="5. Destinations">
                        <DetailRow label="Preferred destination(s)" value={booking.preferredDestinations} />
                    </DetailCard>

                    <DetailCard title="6. Other Requests">
                        <DetailRow label="Special requirements" value={booking.otherRequests || '—'} />
                    </DetailCard>
                </div>
            )}
        </div>
    );
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <AdminSectionPanel title={title}>
            <dl className="space-y-3">{children}</dl>
        </AdminSectionPanel>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-foreground break-words">{value}</dd>
        </div>
    );
}

function EditSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-3 border-b border-border pb-5 last:border-b-0 last:pb-0">
            <h4 className="font-heading text-sm font-semibold text-primary">{title}</h4>
            {children}
        </section>
    );
}

BookingDetail.layout = withAdminLayout('Tour bookings');
