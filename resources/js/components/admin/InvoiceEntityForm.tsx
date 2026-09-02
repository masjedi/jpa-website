import { type FormEvent, useId, useState } from 'react';

import { AdminCollapsibleSection } from '@/components/admin/AdminCollapsibleSection';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { InvoiceLineItemsField } from '@/components/admin/InvoiceLineItemsField';
import {
    calculateInvoiceTotals,
    formatMoney,
} from '@/components/admin/invoiceCalculations';
import {
    createEmptyInvoiceFormValues,
    invoiceCurrencyOptions,
    invoiceStatusOptions,
    type InvoiceFormErrors,
    type InvoiceFormValues,
    validateInvoiceFormValues,
} from '@/components/admin/invoiceForm';
import { cn } from '@/lib/utils';

interface InvoiceEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: InvoiceFormValues;
    onCancel: () => void;
    onSubmit: (values: InvoiceFormValues) => void | Promise<void>;
}

export function InvoiceEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: InvoiceEntityFormProps) {
    const clientNameId = useId();
    const clientEmailId = useId();
    const clientAddressId = useId();
    const tourReferenceId = useId();
    const issuedOnId = useId();
    const dueOnId = useId();
    const currencyId = useId();
    const statusId = useId();
    const notesId = useId();

    const [values, setValues] = useState<InvoiceFormValues>(
        () => initialValues ?? createEmptyInvoiceFormValues(),
    );
    const [errors, setErrors] = useState<InvoiceFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const totals = calculateInvoiceTotals(values.lineItems, values.discountPercent);

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save invoice'
            : submitting
              ? 'Creating…'
              : 'Create invoice';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payloadValues = {
            ...values,
            amount: totals.totalPayable.toFixed(2),
        };
        const nextErrors = validateInvoiceFormValues(payloadValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit(payloadValues);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            aria-busy={submitting}
            className="flex min-h-0 flex-1 flex-col"
        >
            <div className="space-y-2 p-4">
                <div className="grid gap-2 sm:grid-cols-3">
                    <AdminFormField id={statusId} label="Status">
                        <select
                            id={statusId}
                            value={values.status}
                            disabled={submitting}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    status: event.target.value as InvoiceFormValues['status'],
                                }))
                            }
                            className={adminFieldClass}
                        >
                            {invoiceStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </AdminFormField>
                    <AdminFormField id={currencyId} label="Currency">
                        <select
                            id={currencyId}
                            value={values.currency}
                            disabled={submitting}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    currency: event.target.value as InvoiceFormValues['currency'],
                                }))
                            }
                            className={adminFieldClass}
                        >
                            {invoiceCurrencyOptions.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </AdminFormField>
                    <AdminFormField id={`${formId}-total`} label="Total payable">
                        <p className="flex min-h-10 items-center rounded-lg border border-border bg-surface-muted px-3 text-sm font-semibold text-foreground">
                            {formatMoney(totals.totalPayable, values.currency)}
                        </p>
                    </AdminFormField>
                </div>

                <AdminCollapsibleSection
                    title="Client & trip"
                    description="Who this invoice is for, and the related tour."
                    error={Boolean(errors.clientName || errors.clientEmail)}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={clientNameId}
                            label="Client name"
                            required
                            error={errors.clientName}
                            className="sm:col-span-2"
                        >
                            <input
                                id={clientNameId}
                                type="text"
                                value={values.clientName}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        clientName: event.target.value,
                                    }))
                                }
                                aria-invalid={Boolean(errors.clientName)}
                                aria-describedby={adminFieldDescribedBy(
                                    clientNameId,
                                    errors.clientName,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.clientName && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={clientEmailId}
                            label="Client email"
                            required
                            error={errors.clientEmail}
                        >
                            <input
                                id={clientEmailId}
                                type="email"
                                value={values.clientEmail}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        clientEmail: event.target.value,
                                    }))
                                }
                                aria-invalid={Boolean(errors.clientEmail)}
                                aria-describedby={adminFieldDescribedBy(
                                    clientEmailId,
                                    errors.clientEmail,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.clientEmail && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField id={tourReferenceId} label="Tour / reference">
                            <input
                                id={tourReferenceId}
                                type="text"
                                value={values.tourReference}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        tourReference: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                                placeholder="Bamiyan Heritage Journey"
                            />
                        </AdminFormField>
                        <AdminFormField
                            id={clientAddressId}
                            label="Client address"
                            className="sm:col-span-2"
                        >
                            <textarea
                                id={clientAddressId}
                                rows={2}
                                value={values.clientAddress}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        clientAddress: event.target.value,
                                    }))
                                }
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Dates"
                    description="Issue and due dates shown on the invoice."
                    error={Boolean(errors.issuedOn)}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={issuedOnId}
                            label="Issue date"
                            required
                            error={errors.issuedOn}
                        >
                            <input
                                id={issuedOnId}
                                type="date"
                                value={values.issuedOn}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        issuedOn: event.target.value,
                                    }))
                                }
                                aria-invalid={Boolean(errors.issuedOn)}
                                aria-describedby={adminFieldDescribedBy(
                                    issuedOnId,
                                    errors.issuedOn,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.issuedOn && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                        <AdminFormField id={dueOnId} label="Due date">
                            <input
                                id={dueOnId}
                                type="date"
                                value={values.dueOn}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        dueOn: event.target.value,
                                    }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </div>
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Services"
                    description="Line items, discount, and payable total."
                    defaultOpen
                    error={Boolean(errors.lineItems || errors.amount)}
                >
                    <InvoiceLineItemsField
                        currency={values.currency}
                        discountPercent={values.discountPercent}
                        lineItems={values.lineItems}
                        error={errors.lineItems}
                        onChange={(lineItems) =>
                            setValues((current) => ({
                                ...current,
                                lineItems,
                            }))
                        }
                        onDiscountPercentChange={(discountPercent) =>
                            setValues((current) => ({
                                ...current,
                                discountPercent,
                            }))
                        }
                        onTotalChange={(amount) =>
                            setValues((current) => ({
                                ...current,
                                amount,
                            }))
                        }
                    />
                </AdminCollapsibleSection>

                <AdminCollapsibleSection
                    title="Notes"
                    description="Payment terms, bank details, or internal remarks."
                >
                    <AdminFormField id={notesId} label="Notes">
                        <textarea
                            id={notesId}
                            rows={3}
                            value={values.notes}
                            disabled={submitting}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    notes: event.target.value,
                                }))
                            }
                            className={cn(adminFieldClass, 'resize-y')}
                            placeholder="Payment terms, bank details or internal notes."
                        />
                    </AdminFormField>
                </AdminCollapsibleSection>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitLabel}
                </button>
            </footer>
        </form>
    );
}
