import { Form, Link } from '@inertiajs/react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

import { SecureHead } from '@/components/admin/SecureHead';
import { BrandLogo } from '@/components/public/BrandLogo';
import { cn } from '@/lib/utils';

const inputClassName =
    'h-11 w-full rounded-lg border border-white/15 bg-brand-deep px-3.5 text-sm text-white transition-colors placeholder:text-white/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <SecureHead />

            <div className="flex min-h-svh items-center justify-center bg-brand-deep px-4 py-10">
                <div className="w-full max-w-[24rem]">
                    <section className="rounded-2xl border border-white/10 bg-brand-surface">
                        <div className="flex flex-col gap-6 px-6 py-8 sm:px-8">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <BrandLogo
                                    variant="horizontal-white"
                                    href="/"
                                    className="justify-center"
                                    imageClassName="h-14 object-center sm:h-16"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                                        Restricted staff access
                                    </p>
                                    <h1 className="font-heading text-sm font-medium text-brand-on-surface">
                                        Sign in to the dashboard
                                    </h1>
                                    <p className="text-xs leading-relaxed text-white/55">
                                        Use your administrator email and password.
                                    </p>
                                </div>
                            </div>

                            <Form action="/admin/login" method="post" className="flex flex-col gap-5">
                                {({ errors, processing }) => (
                                    <>
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor="email"
                                                className="text-xs font-medium text-brand-on-surface"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="username"
                                                autoFocus
                                                required
                                                aria-invalid={Boolean(errors.email)}
                                                aria-describedby={errors.email ? 'email-error' : undefined}
                                                placeholder="admin@example.com"
                                                className={cn(
                                                    inputClassName,
                                                    errors.email &&
                                                        'border-red-400 focus:border-red-400 focus:ring-red-400/25',
                                                )}
                                            />
                                            {errors.email ? (
                                                <p id="email-error" className="text-sm text-red-300">
                                                    {errors.email}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor="password"
                                                className="text-xs font-medium text-brand-on-surface"
                                            >
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    required
                                                    aria-invalid={Boolean(errors.password)}
                                                    aria-describedby={
                                                        errors.password ? 'password-error' : undefined
                                                    }
                                                    className={cn(
                                                        inputClassName,
                                                        'pe-11',
                                                        errors.password &&
                                                            'border-red-400 focus:border-red-400 focus:ring-red-400/25',
                                                    )}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((visible) => !visible)}
                                                    className="absolute end-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                                    aria-label={
                                                        showPassword ? 'Hide password' : 'Show password'
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="size-4" aria-hidden />
                                                    ) : (
                                                        <Eye className="size-4" aria-hidden />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password ? (
                                                <p id="password-error" className="text-sm text-red-300">
                                                    {errors.password}
                                                </p>
                                            ) : null}
                                        </div>

                                        <label className="flex items-center gap-2.5 text-xs text-white/70">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                value="1"
                                                className="size-4 rounded border-white/30 bg-brand-deep text-secondary focus:ring-secondary/30"
                                            />
                                            Remember this device
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary text-xs font-semibold text-white transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Lock className="size-3.5" aria-hidden />
                                            {processing ? 'Signing in…' : 'Sign in'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>
                    </section>

                    <p className="mt-6 text-center text-xs leading-relaxed text-white/45">
                        Authorized personnel only.{' '}
                        <Link
                            href="/"
                            className="text-white/70 underline-offset-2 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Back to website
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
