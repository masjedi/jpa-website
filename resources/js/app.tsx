import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME ?? 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    pages: './pages',
    strictMode: true,
});
