export type TeamMemberStatus = 'Published' | 'Draft';

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    bio: string;
    email: string;
    whatsapp: string;
    whatsappHref: string;
    image: string;
    order: number;
    status: TeamMemberStatus;
    updated: string;
}

export interface PublicTeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    whatsapp: string;
    whatsappHref: string;
    image: string;
}

export interface TeamAvatarSpec {
    width: number;
    height: number;
    aspect_ratio: string | null;
    max_upload_kilobytes: number;
    hint: string;
}
