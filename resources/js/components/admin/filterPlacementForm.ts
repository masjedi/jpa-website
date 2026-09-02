import type {
    TourFilterOption,
    TourFilterOptionStatus,
    TourFilterOptionType,
} from '@/types/tourFilterOptions';

export interface FilterPlacementFormValues {
    type: TourFilterOptionType;
    name: string;
    status: TourFilterOptionStatus;
}

export function createEmptyFilterPlacementFormValues(
    type: TourFilterOptionType,
): FilterPlacementFormValues {
    return {
        type,
        name: '',
        status: 'Draft',
    };
}

export function filterPlacementToFormValues(
    option: TourFilterOption,
): FilterPlacementFormValues {
    return {
        type: option.type,
        name: option.name,
        status: option.status,
    };
}

export type FilterPlacementFormField = 'name';

export type FilterPlacementFormErrors = Partial<Record<FilterPlacementFormField, string>>;

export function validateFilterPlacementFormValues(
    values: FilterPlacementFormValues,
): FilterPlacementFormErrors {
    const errors: FilterPlacementFormErrors = {};

    if (!values.name.trim()) {
        errors.name = 'Required';
    }

    return errors;
}

export function buildFilterPlacementPayload(
    values: FilterPlacementFormValues,
): Record<string, string> {
    return {
        type: values.type,
        name: values.name.trim(),
        status: values.status,
    };
}
