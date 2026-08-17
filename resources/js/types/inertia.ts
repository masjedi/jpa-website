export type TextDirection = 'ltr' | 'rtl';

export interface SharedPageProps {
    locale: string;
    direction: TextDirection;
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedPageProps {}
}
