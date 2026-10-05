import type { EmergencyContactRow, EmergencyContactStatus } from '@/types/emergencyContacts';

const PHONE_PATTERN = /^\+[1-9][\d\s().-]{6,20}$/;

export interface EmergencyContactFormValues {
    provinceId: string;
    fullName: string;
    position: string;
    organization: string;
    emergencyType: string;
    primaryPhone: string;
    secondaryPhone: string;
    whatsapp: string;
    availabilityNotes: string;
    lastVerifiedAt: string;
    status: EmergencyContactStatus;
    isCustomerShareable: boolean;
    internalNotes: string;
}

export function createEmptyEmergencyContactFormValues(): EmergencyContactFormValues {
    return {
        provinceId: '',
        fullName: '',
        position: '',
        organization: '',
        emergencyType: '',
        primaryPhone: '',
        secondaryPhone: '',
        whatsapp: '',
        availabilityNotes: '',
        lastVerifiedAt: '',
        status: 'Active',
        isCustomerShareable: false,
        internalNotes: '',
    };
}

export function emergencyContactToFormValues(row: EmergencyContactRow): EmergencyContactFormValues {
    return {
        provinceId: String(row.provinceId),
        fullName: row.fullName,
        position: row.position,
        organization: row.organization,
        emergencyType: row.emergencyType,
        primaryPhone: row.primaryPhone,
        secondaryPhone: row.secondaryPhone,
        whatsapp: row.whatsapp,
        availabilityNotes: row.availabilityNotes,
        lastVerifiedAt: row.lastVerifiedAt,
        status: row.status,
        isCustomerShareable: row.isCustomerShareable,
        internalNotes: row.internalNotes,
    };
}

export type EmergencyContactFormField = keyof EmergencyContactFormValues;

export type EmergencyContactFormErrors = Partial<Record<EmergencyContactFormField, string>>;

function invalidOptionalPhone(value: string): boolean {
    return value.trim() !== '' && !PHONE_PATTERN.test(value.trim());
}

export function validateEmergencyContactFormValues(
    values: EmergencyContactFormValues,
): EmergencyContactFormErrors {
    const errors: EmergencyContactFormErrors = {};

    if (!values.provinceId) {
        errors.provinceId = 'Required';
    }

    if (!values.fullName.trim()) {
        errors.fullName = 'Required';
    }

    if (!values.position.trim()) {
        errors.position = 'Required';
    }

    if (!values.organization.trim()) {
        errors.organization = 'Required';
    }

    if (!values.emergencyType) {
        errors.emergencyType = 'Required';
    }

    if (!values.primaryPhone.trim()) {
        errors.primaryPhone = 'Required';
    } else if (!PHONE_PATTERN.test(values.primaryPhone.trim())) {
        errors.primaryPhone = 'Use a country code, for example +93 70 000 0000.';
    }

    if (invalidOptionalPhone(values.secondaryPhone)) {
        errors.secondaryPhone = 'Use a country code, for example +93 70 000 0000.';
    }

    if (invalidOptionalPhone(values.whatsapp)) {
        errors.whatsapp = 'Use a country code, for example +93 70 000 0000.';
    }

    if (!values.lastVerifiedAt) {
        errors.lastVerifiedAt = 'Required';
    }

    return errors;
}

export function buildEmergencyContactPayload(
    values: EmergencyContactFormValues,
): Record<string, string> {
    return {
        province_id: values.provinceId,
        full_name: values.fullName.trim(),
        position: values.position.trim(),
        organization: values.organization.trim(),
        emergency_type: values.emergencyType,
        primary_phone: values.primaryPhone.trim(),
        secondary_phone: values.secondaryPhone.trim(),
        whatsapp: values.whatsapp.trim(),
        availability_notes: values.availabilityNotes.trim(),
        last_verified_at: values.lastVerifiedAt,
        status: values.status,
        is_customer_shareable: values.isCustomerShareable ? '1' : '0',
        internal_notes: values.internalNotes.trim(),
    };
}
