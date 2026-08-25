import type { TeamMember, TeamMemberStatus } from '@/types/team';

export interface TeamFormValues {
    name: string;
    role: string;
    bio: string;
    email: string;
    whatsapp: string;
    whatsappHref: string;
    image: string;
    status: TeamMemberStatus;
}

export function createEmptyTeamFormValues(): TeamFormValues {
    return {
        name: '',
        role: '',
        bio: '',
        email: '',
        whatsapp: '',
        whatsappHref: '',
        image: '',
        status: 'Draft',
    };
}

export function teamMemberToFormValues(
    member: TeamMember,
    status: TeamMemberStatus = member.status,
): TeamFormValues {
    return {
        name: member.name,
        role: member.role,
        bio: member.bio,
        email: member.email,
        whatsapp: member.whatsapp,
        whatsappHref: member.whatsappHref,
        image: member.image,
        status,
    };
}

export type TeamFormField =
    | 'name'
    | 'role'
    | 'bio'
    | 'email'
    | 'whatsapp'
    | 'whatsappHref'
    | 'image';

export type TeamFormErrors = Partial<Record<TeamFormField, string>>;

export interface TeamFormSubmitPayload {
    values: TeamFormValues;
    avatarImage: File | null;
}

const serverFieldMap: Record<string, TeamFormField> = {
    name: 'name',
    role: 'role',
    bio: 'bio',
    email: 'email',
    whatsapp: 'whatsapp',
    whatsapp_href: 'whatsappHref',
    avatar_image: 'image',
};

export function mapServerTeamFormErrors(
    errors: Record<string, string | string[] | undefined>,
): TeamFormErrors {
    const mapped: TeamFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = serverFieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function validateTeamFormValues(
    values: TeamFormValues,
    hasImage: boolean,
): TeamFormErrors {
    const errors: TeamFormErrors = {};
    const text = (value: string | null | undefined): string => (value ?? '').trim();

    if (!text(values.name)) {
        errors.name = 'Required';
    }

    if (!text(values.role)) {
        errors.role = 'Required';
    }

    if (!text(values.bio)) {
        errors.bio = 'Required';
    }

    if (!text(values.email)) {
        errors.email = 'Required';
    }

    if (!text(values.whatsapp)) {
        errors.whatsapp = 'Required';
    }

    if (!text(values.whatsappHref)) {
        errors.whatsappHref = 'Required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    return errors;
}

export function buildTeamFormData({ values, avatarImage }: TeamFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('name', values.name.trim());
    formData.append('role', values.role.trim());
    formData.append('bio', values.bio.trim());
    formData.append('email', values.email.trim());
    formData.append('whatsapp', values.whatsapp.trim());
    formData.append('whatsapp_href', values.whatsappHref.trim());
    formData.append('status', values.status);

    if (avatarImage) {
        formData.append('avatar_image', avatarImage);
    }

    return formData;
}
