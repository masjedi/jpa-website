import { Plus, Trash2 } from 'lucide-react';

import {
    calculateInvoiceTotals,
    calculateLineItemAmount,
    createEmptyLineItem,
    formatMoney,
    formatMoneyInput,
    type InvoiceLineItemFormRow,
} from '@/components/admin/invoiceCalculations';
import { adminFieldClass, adminFieldErrorClass, adminFieldErrorTextClass } from '@/components/admin/adminForm';
import { cn } from '@/lib/utils';

interface InvoiceLineItemsFieldProps {
    currency: string;
    discountPercent: string;
    lineItems: InvoiceLineItemFormRow[];
    error?: string;
    onChange: (lineItems: InvoiceLineItemFormRow[]) => void;
    onDiscountPercentChange: (discountPercent: string) => void;
    onTotalChange: (totalPayable: string) => void;
}

const cellInputClass = cn(adminFieldClass, 'min-w-0 px-2 py-2 text-sm');

export function InvoiceLineItemsField({
    currency,
    discountPercent,
    lineItems,
    error,
    onChange,
    onDiscountPercentChange,
    onTotalChange,
}: InvoiceLineItemsFieldProps) {
    const totals = calculateInvoiceTotals(lineItems, discountPercent);

    const updateLineItem = (id: string, patch: Partial<InvoiceLineItemFormRow>) => {
        const nextItems = lineItems.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
        );
        onChange(nextItems);
        onTotalChange(
            formatMoneyInput(calculateInvoiceTotals(nextItems, discountPercent).totalPayable),
        );
    };

    const addLineItem = () => {
        const nextItems = [...lineItems, createEmptyLineItem()];
        onChange(nextItems);
    };

    const removeLineItem = (id: string) => {
        const nextItems = lineItems.filter((item) => item.id !== id);
        onChange(nextItems);
        onTotalChange(
            formatMoneyInput(calculateInvoiceTotals(nextItems, discountPercent).totalPayable),
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-foreground">
                        Services
                        <span className="text-red-600 dark:text-red-400" aria-hidden>
                            {' '}
                            *
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Add each service with its daily fee and number of days. Totals update
                        automatically.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addLineItem}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    <Plus className="size-3.5" aria-hidden />
                    Add service
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full text-sm">
                    <thead className="bg-surface-muted/70 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        <tr>
                            <th className="px-3 py-3">Item name</th>
                            <th className="px-3 py-3">Fee / day</th>
                            <th className="px-3 py-3">Days</th>
                            <th className="px-3 py-3 text-end">Amount</th>
                            <th className="px-2 py-3">
                                <span className="sr-only">Remove</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {lineItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-3 py-2 align-top">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(event) =>
                                            updateLineItem(item.id, { name: event.target.value })
                                        }
                                        placeholder="Guiding fee"
                                        className={cellInputClass}
                                    />
                                </td>
                                <td className="px-3 py-2 align-top">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.rate}
                                        onChange={(event) =>
                                            updateLineItem(item.id, { rate: event.target.value })
                                        }
                                        className={cn(cellInputClass, 'w-28')}
                                    />
                                </td>
                                <td className="px-3 py-2 align-top">
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={item.days}
                                        onChange={(event) =>
                                            updateLineItem(item.id, { days: event.target.value })
                                        }
                                        className={cn(cellInputClass, 'w-20')}
                                    />
                                </td>
                                <td className="px-3 py-2 align-top text-end font-medium text-foreground">
                                    <div className="flex min-h-10 items-center justify-end">
                                        {formatMoney(calculateLineItemAmount(item), currency)}
                                    </div>
                                </td>
                                <td className="px-2 py-2 align-top">
                                    <button
                                        type="button"
                                        onClick={() => removeLineItem(item.id)}
                                        disabled={lineItems.length === 1}
                                        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Remove service"
                                    >
                                        <Trash2 className="size-4" aria-hidden />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="ml-auto max-w-sm space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                        {formatMoney(totals.subtotal, currency)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="invoice-discount-percent" className="text-muted-foreground">
                        Discount (%)
                    </label>
                    <input
                        id="invoice-discount-percent"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={discountPercent}
                        onChange={(event) => {
                            onDiscountPercentChange(event.target.value);
                            onTotalChange(
                                formatMoneyInput(
                                    calculateInvoiceTotals(lineItems, event.target.value)
                                        .totalPayable,
                                ),
                            );
                        }}
                        className={cn(adminFieldClass, 'w-24 text-end')}
                    />
                </div>
                {totals.discount > 0 ? (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Discount amount</span>
                        <span className="font-medium text-foreground">
                            -{formatMoney(totals.discount, currency)}
                        </span>
                    </div>
                ) : null}
                <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
                    <span className="font-semibold text-foreground">Total payable</span>
                    <span className="font-heading text-lg font-semibold text-foreground">
                        {formatMoney(totals.totalPayable, currency)}
                    </span>
                </div>
            </div>

            {error ? (
                <p role="alert" className={adminFieldErrorTextClass}>
                    {error}
                </p>
            ) : null}
        </div>
    );
}
