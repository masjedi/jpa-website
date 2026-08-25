import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { TeamMember } from '@/types/team';

export function buildTeamViewModel(member: TeamMember): ContentRecordViewModel {
    return {
        title: member.name,
        subtitle: member.role,
        status: member.status,
        imageUrl: member.image,
        imageAlt: member.name,
        showCardPreview: true,
        showContentSection: true,
        bodyPlain: member.bio,
        metaFields: [
            { id: 'email', label: 'Email', value: member.email },
            { id: 'whatsapp', label: 'WhatsApp', value: member.whatsapp },
            { id: 'order', label: 'Order', value: String(member.order) },
            { id: 'updated', label: 'Updated', value: member.updated },
            { id: 'status', label: 'Status', value: member.status },
        ],
    };
}
