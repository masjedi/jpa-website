import { type FormEvent, useId, useState } from 'react';

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
    const amountId = useId();
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
            <div className="grid gap-4 p-4 sm:grid-cols-2">
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
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                clientName: event.target.value,
                            }))
                        }
                        aria-invalid={Boolean(errors.clientName)}
                        aria-describedby={adminFieldDescribedBy(clientNameId, errors.clientName)}
                        className={cn(adminFieldClass, errors.clientName && adminFieldErrorClass)}
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
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                clientEmail: event.target.value,
                            }))
                        }
                        aria-invalid={Boolean(errors.clientEmail)}
                        aria-describedby={adminFieldDescribedBy(clientEmailId, errors.clientEmail)}
                        className={cn(adminFieldClass, errors.clientEmail && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={tourReferenceId} label="Tour / reference">
                    <input
                        id={tourReferenceId}
                        type="text"
                        value={values.tourReference}
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
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                clientAddress: event.target.value,
                            }))
                        }
                        className={cn(adminFieldClass, 'resize-none')}
                    />
                </AdminFormField>

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
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                issuedOn: event.target.value,
                            }))
                        }
                        aria-invalid={Boolean(errors.issuedOn)}
                        aria-describedby={adminFieldDescribedBy(issuedOnId, errors.issuedOn)}
                        className={cn(adminFieldClass, errors.issuedOn && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={dueOnId} label="Due date">
                    <input
                        id={dueOnId}
                        type="date"
                        value={values.dueOn}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                dueOn: event.target.value,
                            }))
                        }
                        className={adminFieldClass}
                    />
                </AdminFormField>

                <div className="sm:col-span-2">
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
                </div>

                <AdminFormField id={currencyId} label="Currency">
                    <select
                        id={currencyId}
                        value={values.currency}
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

                <AdminFormField id={amountId} label="Total payable" required error={errors.amount}>
                    <input
                        id={amountId}
                        type="text"
                        readOnly
                        value={formatMoney(totals.totalPayable, values.currency)}
                        aria-readonly="true"
                        className={cn(adminFieldClass, 'bg-surface-muted font-medium')}
                    />
                </AdminFormField>

                <AdminFormField id={statusId} label="Status" className="sm:col-span-2">
                    <select
                        id={statusId}
                        value={values.status}
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

                <AdminFormField id={notesId} label="Notes" className="sm:col-span-2">
                    <textarea
                        id={notesId}
                        rows={3}
                        value={values.notes}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                notes: event.target.value,
                            }))
                        }
                        className={cn(adminFieldClass, 'resize-none')}
                        placeholder="Payment terms, bank details or internal notes for your team."
                    />
                </AdminFormField>
            </div>

            <div className="mt-auto flex flex-col-reverse gap-2 border-t border-border px-4 py-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
