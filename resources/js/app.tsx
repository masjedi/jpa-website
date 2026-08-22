import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';

import { NavigationProgress } from '@/components/loading/NavigationProgress';
import { AppearanceProvider } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME ?? 'Journey to Peace Afghanistan Tours';

router.on('navigate', () => {
    window.scrollTo(0, 0);
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    pages: './pages',
    strictMode: true,
    withApp: (app) => (
        <AppearanceProvider>
            <NavigationProgress />
            {app}
        </AppearanceProvider>
    ),
});
