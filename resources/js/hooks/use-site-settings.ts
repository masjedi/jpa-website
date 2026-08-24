import { usePage } from '@inertiajs/react';

import {
    resolveSiteSettings,
    type SiteSettings,
} from '@/components/public/brand';
import type { SharedPageProps } from '@/types/inertia';

export function useSiteSettings(): SiteSettings {
    const { siteSettings } = usePage<SharedPageProps>().props;

    return resolveSiteSettings(siteSettings);
}
