import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';

import { AppearanceProvider } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME ?? 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    pages: './pages',
    strictMode: true,
    withApp: (app) => <AppearanceProvider>{app}</AppearanceProvider>,
});
