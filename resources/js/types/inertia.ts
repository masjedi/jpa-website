export type TextDirection = 'ltr' | 'rtl';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface SharedPageProps {
    locale: string;
    direction: TextDirection;
    appName: string;
    appUrl: string;
    auth: {
        user: AuthUser | null;
    };
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedPageProps {}
}
