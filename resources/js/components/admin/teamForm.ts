import type { TeamMember, TeamMemberStatus } from '@/types/team';
import type { TranslatedString } from '@/types/locale';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired } from '@/lib/translatableForm';

export interface TeamFormValues {
    name: TranslatedString;
    role: TranslatedString;
    bio: TranslatedString;
    email: string;
    whatsapp: string;
    whatsappHref: string;
    image: string;
    status: TeamMemberStatus;
}

export function createEmptyTeamFormValues(): TeamFormValues {
    return {
        name: createEmptyTranslatedString(),
        role: createEmptyTranslatedString(),
        bio: createEmptyTranslatedString(),
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
        name: normalizeTranslatedString(member.name),
        role: normalizeTranslatedString(member.role),
        bio: normalizeTranslatedString(member.bio),
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

const serverFieldMap = {
    ...buildTranslatableFieldMap('', ['name', 'role', 'bio']),
    email: 'email',
    whatsapp: 'whatsapp',
    whatsapp_href: 'whatsappHref',
    avatar_image: 'image',
};

export function mapServerTeamFormErrors(
    errors: Record<string, string | string[] | undefined>,
): TeamFormErrors {
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function validateTeamFormValues(
    values: TeamFormValues,
    hasImage: boolean,
): TeamFormErrors {
    const errors: TeamFormErrors = {};
    const text = (value: string | null | undefined): string => (value ?? '').trim();

    const nameError = validateEnglishRequired(values.name, 'Name');
    if (nameError) {
        errors.name = nameError;
    }

    const roleError = validateEnglishRequired(values.role, 'Role');
    if (roleError) {
        errors.role = roleError;
    }

    const bioError = validateEnglishRequired(values.bio, 'Bio');
    if (bioError) {
        errors.bio = bioError;
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

    appendTranslatedStringToFormData(formData, 'name', values.name);
    appendTranslatedStringToFormData(formData, 'role', values.role);
    appendTranslatedStringToFormData(formData, 'bio', values.bio);
    formData.append('email', values.email.trim());
    formData.append('whatsapp', values.whatsapp.trim());
    formData.append('whatsapp_href', values.whatsappHref.trim());
    formData.append('status', values.status);

    if (avatarImage) {
        formData.append('avatar_image', avatarImage);
    }

    return formData;
}
