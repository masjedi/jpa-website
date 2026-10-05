import type {
    TourFilterOption,
    TourFilterOptionStatus,
    TourFilterOptionType,
} from '@/types/tourFilterOptions';
import type { TranslatedString } from '@/types/locale';
import {
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired, type AdminJsonPayload } from '@/lib/translatableForm';

export interface FilterPlacementFormValues {
    type: TourFilterOptionType;
    name: TranslatedString;
    value: string;
    status: TourFilterOptionStatus;
}

export function createEmptyFilterPlacementFormValues(
    type: TourFilterOptionType,
): FilterPlacementFormValues {
    return {
        type,
        name: createEmptyTranslatedString(),
        value: '',
        status: 'Draft',
    };
}

export function filterPlacementToFormValues(
    option: TourFilterOption,
): FilterPlacementFormValues {
    return {
        type: option.type,
        name: normalizeTranslatedString(option.name),
        value: option.value,
        status: option.status,
    };
}

export type FilterPlacementFormField = 'name';

export type FilterPlacementFormErrors = Partial<Record<FilterPlacementFormField, string>>;

const serverFieldMap = buildTranslatableFieldMap('', ['name']);

export function mapServerFilterPlacementFormErrors(
    errors: Record<string, string | string[] | undefined>,
): FilterPlacementFormErrors {
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function validateFilterPlacementFormValues(
    values: FilterPlacementFormValues,
): FilterPlacementFormErrors {
    const errors: FilterPlacementFormErrors = {};

    const nameError = validateEnglishRequired(values.name, 'Name');
    if (nameError) {
        errors.name = nameError;
    }

    return errors;
}

export function buildFilterPlacementPayload(
    values: FilterPlacementFormValues,
): AdminJsonPayload {
    return {
        type: values.type,
        name: values.name,
        status: values.status,
    };
}
