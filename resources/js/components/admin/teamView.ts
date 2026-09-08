import type { ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { primaryTranslation } from '@/lib/translations';
import type { TeamMember } from '@/types/team';

export function buildTeamViewModel(member: TeamMember): ContentRecordViewModel {
    const name = primaryTranslation(member.name);
    const role = primaryTranslation(member.role);
    const bio = primaryTranslation(member.bio);

    return {
        title: name,
        subtitle: role,
        status: member.status,
        imageUrl: member.image,
        imageAlt: name,
        showCardPreview: true,
        showContentSection: true,
        bodyPlain: bio,
        metaFields: [
            { id: 'email', label: 'Email', value: member.email },
            { id: 'whatsapp', label: 'WhatsApp', value: member.whatsapp },
            { id: 'order', label: 'Order', value: String(member.order) },
            { id: 'updated', label: 'Updated', value: member.updated },
            { id: 'status', label: 'Status', value: member.status },
        ],
    };
}
