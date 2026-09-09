import { Form, usePage } from '@inertiajs/react';
import { KeyRound, Mail, Shield, UserRound } from 'lucide-react';
import { useState } from 'react';

import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';

interface AccountPageProps {
    account: {
        name: string;
        email: string;
    };
}

export default function Account({ account }: AccountPageProps) {
    const { flash } = usePage().props;
    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-4">
            {flash.success ? (
                <div
                    role="status"
                    className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                >
                    {flash.success}
                </div>
            ) : null}

            <AdminSectionHeader
                eyebrow="Access"
                title="Account"
                description="Manage your administrator sign-in details. Use your email address and password at the dashboard login page."
                icon={UserRound}
            />

            <AdminSectionPanel
                title="Signed-in administrator"
                description="This email is your dashboard username."
            >
                <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            Name
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-foreground">{account.name}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            Email (username)
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-foreground" dir="ltr">
                            {account.email}
                        </dd>
                    </div>
                </dl>
            </AdminSectionPanel>

            <AdminSectionPanel
                title="Change email"
                description="Enter a new email address and confirm with your current password. This becomes your dashboard login username."
            >
                <Form
                    action="/admin/account/email"
                    method="post"
                    className="mx-auto max-w-xl space-y-4"
                    resetOnSuccess={['current_password']}
                >
                    {({ errors, processing }) => (
                        <>
                            <input type="hidden" name="_method" value="patch" />

                            <AdminFormField
                                id="email"
                                label="New email"
                                required
                                error={errors.email}
                            >
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={account.email}
                                    autoComplete="username"
                                    required
                                    dir="ltr"
                                    aria-invalid={Boolean(errors.email)}
                                    className={cn(
                                        adminFieldClass,
                                        errors.email && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <AdminFormField
                                id="email_current_password"
                                label="Current password"
                                required
                                error={errors.current_password}
                            >
                                <input
                                    id="email_current_password"
                                    name="current_password"
                                    type={showEmailPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    aria-invalid={Boolean(errors.current_password)}
                                    className={cn(
                                        adminFieldClass,
                                        errors.current_password && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <button
                                type="button"
                                onClick={() => setShowEmailPassword((visible) => !visible)}
                                className="text-xs font-medium text-secondary hover:underline"
                            >
                                {showEmailPassword ? 'Hide current password' : 'Show current password'}
                            </button>

                            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                                <Shield className="size-4 shrink-0 text-secondary" aria-hidden />
                                After saving, sign in with the new email and your existing password.
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Mail className="size-4" aria-hidden />
                                {processing ? 'Saving…' : 'Update email'}
                            </button>
                        </>
                    )}
                </Form>
            </AdminSectionPanel>

            <AdminSectionPanel
                title="Change password"
                description="Enter your current password, then choose a new one with at least 12 characters."
            >
                <Form
                    action="/admin/account/password"
                    method="post"
                    className="mx-auto max-w-xl space-y-4"
                    resetOnSuccess={['current_password', 'password', 'password_confirmation']}
                >
                    {({ errors, processing }) => (
                        <>
                            <input type="hidden" name="_method" value="patch" />

                            <AdminFormField
                                id="current_password"
                                label="Current password"
                                required
                                error={errors.current_password}
                            >
                                <input
                                    id="current_password"
                                    name="current_password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    aria-invalid={Boolean(errors.current_password)}
                                    className={cn(
                                        adminFieldClass,
                                        errors.current_password && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((visible) => !visible)}
                                className="text-xs font-medium text-secondary hover:underline"
                            >
                                {showCurrentPassword ? 'Hide current password' : 'Show current password'}
                            </button>

                            <AdminFormField
                                id="password"
                                label="New password"
                                required
                                error={errors.password}
                            >
                                <input
                                    id="password"
                                    name="password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={12}
                                    aria-invalid={Boolean(errors.password)}
                                    className={cn(
                                        adminFieldClass,
                                        errors.password && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <button
                                type="button"
                                onClick={() => setShowNewPassword((visible) => !visible)}
                                className="text-xs font-medium text-secondary hover:underline"
                            >
                                {showNewPassword ? 'Hide new password' : 'Show new password'}
                            </button>

                            <AdminFormField
                                id="password_confirmation"
                                label="Confirm new password"
                                required
                                error={errors.password_confirmation}
                            >
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={12}
                                    aria-invalid={Boolean(errors.password_confirmation)}
                                    className={cn(
                                        adminFieldClass,
                                        errors.password_confirmation && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((visible) => !visible)}
                                className="text-xs font-medium text-secondary hover:underline"
                            >
                                {showConfirmPassword
                                    ? 'Hide password confirmation'
                                    : 'Show password confirmation'}
                            </button>

                            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                                <Shield className="size-4 shrink-0 text-secondary" aria-hidden />
                                After saving, keep using the same email address with your new password.
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <KeyRound className="size-4" aria-hidden />
                                {processing ? 'Saving…' : 'Update password'}
                            </button>
                        </>
                    )}
                </Form>
            </AdminSectionPanel>
        </div>
    );
}

Account.layout = withAdminLayout('Account');
