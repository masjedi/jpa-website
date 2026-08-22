import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import inertia from '@inertiajs/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
        inertia(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    build: {
        sourcemap: false,
        cssMinify: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (id.includes('motion')) {
                        return 'vendor-motion';
                    }

                    if (id.includes('@inertiajs')) {
                        return 'vendor-inertia';
                    }

                    if (id.includes('react-dom') || id.includes('react/')) {
                        return 'vendor-react';
                    }

                    if (id.includes('ogl')) {
                        return 'vendor-ogl';
                    }

                    if (id.includes('@use-gesture')) {
                        return 'vendor-gesture';
                    }

                    if (id.includes('lucide-react')) {
                        return 'vendor-icons';
                    }

                    return undefined;
                },
            },
        },
    },
    server: {
        watch: {
            ignored: [
                '**/storage/framework/views/**',
                '**/.cursor/**',
                '**/.agents/**',
                '**/docs/**',
            ],
        },
    },
});
