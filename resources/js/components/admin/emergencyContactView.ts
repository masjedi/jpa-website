import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { EmergencyContactRow } from '@/types/emergencyContacts';

export function buildEmergencyContactViewModel(
    contact: EmergencyContactRow,
): ContentRecordViewModel {
    return {
        title: contact.fullName,
        subtitle: `${contact.position} · ${contact.organization}`,
        badgeLabel: contact.verificationAgeLabel,
        layout: 'compact',
        showCardPreview: false,
        showContentSection: false,
        metaFields: [
            { id: 'province', label: 'Province', value: contact.province },
            { id: 'type', label: 'Emergency type', value: contact.emergencyTypeLabel },
            { id: 'primary', label: 'Primary phone', value: contact.primaryPhone },
            { id: 'secondary', label: 'Secondary phone', value: contact.secondaryPhone || '—' },
            { id: 'whatsapp', label: 'WhatsApp', value: contact.whatsapp || '—' },
            { id: 'verified', label: 'Last verified', value: contact.lastVerifiedLabel },
            { id: 'verifier', label: 'Verified by', value: contact.verifiedByName || '—' },
            { id: 'status', label: 'Status', value: contact.status },
            {
                id: 'shareable',
                label: 'Customer shareable',
                value: contact.isEligibleForCustomerSharing ? 'Yes' : 'No',
            },
            {
                id: 'availability',
                label: 'Availability',
                value: contact.availabilityNotes || '—',
            },
            { id: 'internal', label: 'Internal notes', value: contact.internalNotes || '—', span: 2 },
        ],
    };
}
