export type TextDirection = 'ltr' | 'rtl';

export interface SharedPageProps {
    locale: string;
    direction: TextDirection;
    appName: string;
    appUrl: string;
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedPageProps {}
}
