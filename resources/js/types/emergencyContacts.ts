export type EmergencyContactStatus = 'Active' | 'Inactive';

export type EmergencyContactVerificationAge = 'recent' | 'aging' | 'stale';

export interface EmergencyTypeOption {
    value: string;
    label: string;
}

export interface EmergencyContactProvinceOption {
    id: number;
    name: string;
}

export interface EmergencyContactRow {
    id: number;
    provinceId: number;
    province: string;
    fullName: string;
    position: string;
    organization: string;
    emergencyType: string;
    emergencyTypeLabel: string;
    primaryPhone: string;
    secondaryPhone: string;
    whatsapp: string;
    availabilityNotes: string;
    lastVerifiedAt: string;
    lastVerifiedLabel: string;
    verificationAge: EmergencyContactVerificationAge;
    verificationAgeLabel: string;
    verifiedByName: string;
    status: EmergencyContactStatus;
    isCustomerShareable: boolean;
    isEligibleForCustomerSharing: boolean;
    internalNotes: string;
}

export interface EmergencyContactFilters {
    search: string;
    province_id: string;
    emergency_type: string;
    status: string;
    shareable: string;
    sort: string;
    direction: string;
}
