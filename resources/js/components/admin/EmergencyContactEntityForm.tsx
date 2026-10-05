import { type FormEvent, useId, useState } from 'react';

import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyEmergencyContactFormValues,
    validateEmergencyContactFormValues,
    type EmergencyContactFormErrors,
    type EmergencyContactFormValues,
} from '@/components/admin/emergencyContactForm';
import { cn } from '@/lib/utils';
import type {
    EmergencyContactProvinceOption,
    EmergencyTypeOption,
} from '@/types/emergencyContacts';

interface EmergencyContactEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    provinces: readonly EmergencyContactProvinceOption[];
    emergencyTypes: readonly EmergencyTypeOption[];
    statusOptions?: readonly string[];
    initialValues?: EmergencyContactFormValues;
    onCancel: () => void;
    onSubmit: (values: EmergencyContactFormValues) => void | Promise<void>;
}

export function EmergencyContactEntityForm({
    formId,
    mode,
    provinces,
    emergencyTypes,
    statusOptions = ['Active', 'Inactive'],
    initialValues,
    onCancel,
    onSubmit,
}: EmergencyContactEntityFormProps) {
    const provinceFieldId = useId();
    const nameFieldId = useId();
    const positionFieldId = useId();
    const organizationFieldId = useId();
    const typeFieldId = useId();
    const primaryPhoneFieldId = useId();
    const secondaryPhoneFieldId = useId();
    const whatsappFieldId = useId();
    const availabilityFieldId = useId();
    const verifiedFieldId = useId();
    const statusFieldId = useId();
    const shareableFieldId = useId();
    const notesFieldId = useId();

    const [values, setValues] = useState<EmergencyContactFormValues>(
        () => initialValues ?? createEmptyEmergencyContactFormValues(),
    );
    const [errors, setErrors] = useState<EmergencyContactFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create contact';

    const patch = <K extends keyof EmergencyContactFormValues>(
        key: K,
        value: EmergencyContactFormValues[K],
    ) => {
        setValues((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateEmergencyContactFormValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    };

    const officialHasError = Boolean(
        errors.provinceId ||
            errors.fullName ||
            errors.position ||
            errors.organization ||
            errors.emergencyType,
    );
    const contactHasError = Boolean(
        errors.primaryPhone || errors.secondaryPhone || errors.whatsapp,
    );
    const operationalHasError = Boolean(errors.lastVerifiedAt);

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            aria-busy={submitting}
            className="flex min-h-0 flex-1 flex-col"
        >
            <div className="space-y-3 overflow-y-auto p-4">
                <AdminCollapsibleSection
                    title="Official information"
                    description="Province, name, role, and emergency type."
                    defaultOpen
                    error={officialHasError}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={provinceFieldId}
                            label="Province"
                            required
                            error={errors.provinceId}
                        >
                            <select
                                id={provinceFieldId}
                                value={values.provinceId}
                                disabled={submitting}
                                onChange={(event) => patch('provinceId', event.target.value)}
                                aria-invalid={Boolean(errors.provinceId)}
                                aria-describedby={adminFieldDescribedBy(
                                    provinceFieldId,
                                    errors.provinceId,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.provinceId && adminFieldErrorClass,
                                )}
                            >
                                <option value="">Select province</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>
                        <AdminFormField
                            id={typeFieldId}
                            label="Emergency type"
                            required
                            error={errors.emergencyType}
                        >
                            <select
                                id={typeFieldId}
                                value={values.emergencyType}
                                disabled={submitting}
                                onChange={(event) => patch('emergencyType', event.target.value)}
                                aria-invalid={Boolean(errors.emergencyType)}
                                aria-describedby={adminFieldDescribedBy(
                                    typeFieldId,
                                    errors.emergencyType,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.emergencyType && adminFieldErrorClass,
                                )}
                            >
                                <option value="">Select type</option>
                                {emergencyTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>
                        <AdminFormField
                            id={nameFieldId}
                            label="Full name"
                            required
                            error={errors.fullName}
                            className="sm:col-span-2"
                        >
                            <input
                                id={nameFieldId}
                                value={values.fullName}
                                disabled={submitting}
                                onChange={(event) => patch('fullName', event.target.value)}
                                aria-invalid={Boolean(errors.fullName)}
                                aria-describedby={adminFieldDescribedBy(nameFieldId, errors.fullName)}
                                className={cn(adminFieldClass, errors.fullName && adminFieldErrorClass)}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={positionFieldId}
                            label="Position / Role"
                            required
                            error={errors.position}
                        >
                            <input
                                id={positionFieldId}
                                value={values.position}
                                disabled={submitting}
                                onChange={(event) => patch('position', event.target.value)}
                                aria-invalid={Boolean(errors.position)}
                                aria-describedby={adminFieldDescribedBy(
                                    positionFieldId,
                                    errors.position,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.position && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={organizationFieldId}
                            label="Organization / Department"
                            required
                            error={errors.organization}
                        >
                            <input
                                id={organizationFieldId}
                                value={values.organization}
                                disabled={submitting}
                                onChange={(event) => patch('organization', event.target.value)}
                                aria-invalid={Boolean(errors.organization)}
                                aria-describedby={adminFieldDescribedBy(
                                    organizationFieldId,
                                    errors.organization,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.organization && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Contact information"
                    description="International numbers with country code."
                    defaultOpen
                    error={contactHasError}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={primaryPhoneFieldId}
                            label="Primary phone"
                            required
                            error={errors.primaryPhone}
                        >
                            <input
                                id={primaryPhoneFieldId}
                                type="tel"
                                inputMode="tel"
                                placeholder="+93 …"
                                value={values.primaryPhone}
                                disabled={submitting}
                                onChange={(event) => patch('primaryPhone', event.target.value)}
                                aria-invalid={Boolean(errors.primaryPhone)}
                                aria-describedby={adminFieldDescribedBy(
                                    primaryPhoneFieldId,
                                    errors.primaryPhone,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.primaryPhone && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={secondaryPhoneFieldId}
                            label="Secondary phone"
                            error={errors.secondaryPhone}
                        >
                            <input
                                id={secondaryPhoneFieldId}
                                type="tel"
                                inputMode="tel"
                                placeholder="+93 …"
                                value={values.secondaryPhone}
                                disabled={submitting}
                                onChange={(event) => patch('secondaryPhone', event.target.value)}
                                aria-invalid={Boolean(errors.secondaryPhone)}
                                aria-describedby={adminFieldDescribedBy(
                                    secondaryPhoneFieldId,
                                    errors.secondaryPhone,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.secondaryPhone && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={whatsappFieldId}
                            label="WhatsApp"
                            error={errors.whatsapp}
                            className="sm:col-span-2"
                        >
                            <input
                                id={whatsappFieldId}
                                type="tel"
                                inputMode="tel"
                                placeholder="+93 …"
                                value={values.whatsapp}
                                disabled={submitting}
                                onChange={(event) => patch('whatsapp', event.target.value)}
                                aria-invalid={Boolean(errors.whatsapp)}
                                aria-describedby={adminFieldDescribedBy(
                                    whatsappFieldId,
                                    errors.whatsapp,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.whatsapp && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Operational information"
                    description="Verification, sharing, and internal notes."
                    defaultOpen
                    error={operationalHasError}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={verifiedFieldId}
                            label="Last verified date"
                            required
                            error={errors.lastVerifiedAt}
                        >
                            <input
                                id={verifiedFieldId}
                                type="date"
                                max={new Date().toISOString().slice(0, 10)}
                                value={values.lastVerifiedAt}
                                disabled={submitting}
                                onChange={(event) => patch('lastVerifiedAt', event.target.value)}
                                aria-invalid={Boolean(errors.lastVerifiedAt)}
                                aria-describedby={adminFieldDescribedBy(
                                    verifiedFieldId,
                                    errors.lastVerifiedAt,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.lastVerifiedAt && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField id={statusFieldId} label="Status">
                            <select
                                id={statusFieldId}
                                value={values.status}
                                disabled={submitting}
                                onChange={(event) =>
                                    patch('status', event.target.value as EmergencyContactFormValues['status'])
                                }
                                className={adminFieldClass}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>
                        <AdminFormField id={shareableFieldId} label="Safe for customer sharing">
                            <select
                                id={shareableFieldId}
                                value={values.isCustomerShareable ? '1' : '0'}
                                disabled={submitting}
                                onChange={(event) =>
                                    patch('isCustomerShareable', event.target.value === '1')
                                }
                                className={adminFieldClass}
                            >
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </AdminFormField>
                        <AdminFormField
                            id={availabilityFieldId}
                            label="Availability notes"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={availabilityFieldId}
                                rows={2}
                                value={values.availabilityNotes}
                                disabled={submitting}
                                onChange={(event) => patch('availabilityNotes', event.target.value)}
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={notesFieldId}
                            label="Internal notes"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={notesFieldId}
                                rows={3}
                                value={values.internalNotes}
                                disabled={submitting}
                                onChange={(event) => patch('internalNotes', event.target.value)}
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitLabel}
                </button>
            </footer>
        </form>
    );
}
