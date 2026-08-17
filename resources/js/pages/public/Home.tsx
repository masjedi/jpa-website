import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Home" />

            <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    Afghanistan Tourism
                </h1>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
                    Laravel, Inertia and React are configured successfully.
                </p>
            </main>
        </>
    );
}
