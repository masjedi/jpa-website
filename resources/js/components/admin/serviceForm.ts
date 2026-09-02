import type {
    ServiceCategory,
    ServiceIconOption,
    ServiceOffering,
    ServiceOfferingStatus,
} from '@/types/services';

export interface ServiceFormValues {
    title: string;
    slug: string;
    tagline: string;
    description: string;
    category: ServiceCategory;
    iconKey: string;
    featuresText: string;
    isFeatured: boolean;
    showOnHome: boolean;
    status: ServiceOfferingStatus;
}

export function createEmptyServiceFormValues(
    iconOptions: readonly ServiceIconOption[],
    categoryOptions: readonly ServiceCategory[],
): ServiceFormValues {
    return {
        title: '',
        slug: '',
        tagline: '',
        description: '',
        category: categoryOptions[0] ?? 'Journey',
        iconKey: iconOptions[0]?.value ?? 'users',
        featuresText: '',
        isFeatured: false,
        showOnHome: false,
        status: 'Draft',
    };
}

export function serviceToFormValues(offering: ServiceOffering): ServiceFormValues {
    return {
        title: offering.title,
        slug: offering.slug,
        tagline: offering.tagline,
        description: offering.description,
        category: offering.category,
        iconKey: offering.iconKey,
        featuresText: offering.features.join('\n'),
        isFeatured: offering.isFeatured,
        showOnHome: offering.showOnHome,
        status: offering.status,
    };
}

export type ServiceFormField = 'title' | 'tagline' | 'description' | 'featuresText';

export type ServiceFormErrors = Partial<Record<ServiceFormField, string>>;

export function validateServiceFormValues(values: ServiceFormValues): ServiceFormErrors {
    const errors: ServiceFormErrors = {};

    if (!values.title.trim()) {
        errors.title = 'Required';
    }

    if (!values.tagline.trim()) {
        errors.tagline = 'Required';
    }

    if (!values.description.trim()) {
        errors.description = 'Required';
    }

    if (!values.featuresText.trim()) {
        errors.featuresText = 'Add at least one feature';
    }

    return errors;
}

export function buildServicePayload(values: ServiceFormValues): Record<string, string> {
    return {
        title: values.title.trim(),
        slug: values.slug.trim(),
        tagline: values.tagline.trim(),
        description: values.description.trim(),
        category: values.category,
        icon_key: values.iconKey,
        features_text: values.featuresText.trim(),
        is_featured: values.isFeatured ? '1' : '0',
        show_on_home: values.showOnHome ? '1' : '0',
        status: values.status,
    };
}
