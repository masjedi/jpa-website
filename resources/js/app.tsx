import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';

import { NavigationProgress } from '@/components/loading/NavigationProgress';
import { BRAND_NAME } from '@/components/public/brand';
import { AppearanceProvider } from '@/hooks/use-appearance';
import { SECURE_TAB_TITLE } from '@/lib/secureTabTitle';

const titleSuffix = 'Journey to Peace';
const appName = import.meta.env.VITE_APP_NAME || BRAND_NAME;

router.on('navigate', () => {
    window.scrollTo(0, 0);
});

createInertiaApp({
    title: (title) => {
        if (title === SECURE_TAB_TITLE) {
            return SECURE_TAB_TITLE;
        }

        if (!title || title === appName || title === titleSuffix) {
            return titleSuffix;
        }

        return `${title} - ${titleSuffix}`;
    },
    pages: './pages',
    strictMode: true,
    withApp: (app) => (
        <AppearanceProvider>
            <NavigationProgress />
            {app}
        </AppearanceProvider>
    ),
});
