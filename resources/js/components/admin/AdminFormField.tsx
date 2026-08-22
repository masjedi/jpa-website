import { type ReactNode } from 'react';

import { adminFieldErrorTextClass } from '@/components/admin/adminForm';
import { cn } from '@/lib/utils';

interface AdminFormFieldProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    className?: string;
    children: ReactNode;
}

export function AdminFormField({
    id,
    label,
    required = false,
    error,
    className,
    children,
}: AdminFormFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div className={cn('space-y-1', className)}>
            <label htmlFor={id} className="text-xs font-medium text-foreground">
                {label}
                {required ? (
                    <>
                        <span className="text-red-600 dark:text-red-400" aria-hidden>
                            {' '}
                            *
                        </span>
                        <span className="sr-only"> (required)</span>
                    </>
                ) : null}
            </label>

            {children}

            {error ? (
                <p id={errorId} role="alert" className={adminFieldErrorTextClass}>
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function adminFieldDescribedBy(id: string, error?: string): string | undefined {
    return error ? `${id}-error` : undefined;
}
