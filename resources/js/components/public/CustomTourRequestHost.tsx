import { useEffect, useState } from 'react';

import { CustomTourRequestDialog } from '@/components/public/CustomTourRequestDialog';

export const OPEN_CUSTOM_TOUR_EVENT = 'jpa:open-custom-tour';
export const CUSTOM_TOUR_QUERY = 'custom_tour';

export type SeasonalPackageRequestContext = {
    requestKind: 'seasonal_package';
    packageTitle: string;
    packagePrice?: string;
};

export type CustomTourRequestOpenDetail = SeasonalPackageRequestContext | null | undefined;

export function openCustomTourRequest(detail?: CustomTourRequestOpenDetail): void {
    window.dispatchEvent(
        new CustomEvent<CustomTourRequestOpenDetail>(OPEN_CUSTOM_TOUR_EVENT, {
            detail: detail ?? null,
        }),
    );
}

export function openSeasonalPackageRequest(packageTitle: string, packagePrice = ''): void {
    openCustomTourRequest({
        requestKind: 'seasonal_package',
        packageTitle,
        packagePrice,
    });
}

function consumeCustomTourQuery(): boolean {
    const url = new URL(window.location.href);
    if (url.searchParams.get(CUSTOM_TOUR_QUERY) !== '1') {
        return false;
    }

    url.searchParams.delete(CUSTOM_TOUR_QUERY);
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, '', next || '/');

    return true;
}

export function CustomTourRequestHost() {
    const [open, setOpen] = useState(false);
    const [packageContext, setPackageContext] = useState<SeasonalPackageRequestContext | null>(null);

    useEffect(() => {
        if (consumeCustomTourQuery()) {
            setPackageContext(null);
            setOpen(true);
        }

        const handleOpen = (event: Event) => {
            const detail = (event as CustomEvent<CustomTourRequestOpenDetail>).detail;
            if (detail?.requestKind === 'seasonal_package' && detail.packageTitle.trim() !== '') {
                setPackageContext({
                    requestKind: 'seasonal_package',
                    packageTitle: detail.packageTitle.trim(),
                    packagePrice: detail.packagePrice?.trim() || '',
                });
            } else {
                setPackageContext(null);
            }
            setOpen(true);
        };

        window.addEventListener(OPEN_CUSTOM_TOUR_EVENT, handleOpen);

        return () => window.removeEventListener(OPEN_CUSTOM_TOUR_EVENT, handleOpen);
    }, []);

    return (
        <CustomTourRequestDialog
            isOpen={open}
            onClose={() => {
                setOpen(false);
                setPackageContext(null);
            }}
            packageContext={packageContext}
        />
    );
}
