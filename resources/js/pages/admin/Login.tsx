import { Form, Head } from '@inertiajs/react';

import { BrandLogo } from '@/components/public/BrandLogo';
import { cn } from '@/lib/utils';

const inputClassName =
    'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/25';

export default function Login() {
    return (
        <>
            <Head title="Admin sign in" />

            <div className="flex min-h-screen flex-col bg-background lg:flex-row lg:bg-brand-deep">
                <section className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,115,115,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(215,162,58,0.2),transparent_50%)]" />
                    <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
                        <BrandLogo variant="horizontal-white" href="/" />
                        <div className="max-w-md space-y-4">
                            <p className="text-sm font-medium uppercase tracking-[0.16em] text-secondary">
                                Journey to Peace CMS
                            </p>
                            <h2 className="font-heading text-3xl font-semibold leading-tight text-white xl:text-4xl">
                                Manage tours, stories, and traveler inquiries in one calm workspace.
                            </h2>
                            <p className="text-sm leading-relaxed text-white/70">
                                Sign in with your administrator account to access the dashboard.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 lg:max-w-xl lg:px-10 xl:max-w-2xl">
                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <BrandLogo variant="horizontal-color" href="/" className="justify-center" />
                        </div>

                        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                            <div className="mb-8 space-y-2">
                                <h1 className="font-heading text-2xl font-semibold text-foreground">
                                    Admin sign in
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Use your administrator credentials to continue to the dashboard.
                                </p>
                            </div>

                            <Form action="/admin/login" method="post" className="space-y-5">
                                {({ errors, processing }) => (
                                    <>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="username"
                                                required
                                                className={cn(
                                                    inputClassName,
                                                    errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                                )}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="password"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                className={cn(
                                                    inputClassName,
                                                    errors.password &&
                                                        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                                )}
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                value="1"
                                                className="size-4 rounded border-border text-secondary focus:ring-focus/25"
                                            />
                                            Keep me signed in on this device
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing ? 'Signing in…' : 'Sign in to dashboard'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>

                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            Public website visitors are not affected by this sign-in area.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
