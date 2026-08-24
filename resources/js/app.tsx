import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';

import { NavigationProgress } from '@/components/loading/NavigationProgress';
import { BRAND_NAME } from '@/components/public/brand';
import { AppearanceProvider } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || BRAND_NAME;

router.on('navigate', () => {
    window.scrollTo(0, 0);
});

createInertiaApp({
    title: (title) => {
        if (!title || title === appName) {
            return appName;
        }

        return `${title} - ${appName}`;
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
