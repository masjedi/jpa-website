import { Plus, Trash2 } from 'lucide-react';

import {
    calculateInvoiceTotals,
    calculateLineItemAmount,
    createEmptyLineItem,
    formatMoney,
    formatMoneyInput,
    type InvoiceLineItemFormRow,
} from '@/components/admin/invoiceCalculations';
import { adminFieldClass, adminFieldErrorTextClass } from '@/components/admin/adminForm';
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

const compactInputClass = cn(adminFieldClass, 'min-w-0 px-2.5 py-1.5 text-sm');

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
        onChange([...lineItems, createEmptyLineItem()]);
    };

    const removeLineItem = (id: string) => {
        const nextItems = lineItems.filter((item) => item.id !== id);
        onChange(nextItems);
        onTotalChange(
            formatMoneyInput(calculateInvoiceTotals(nextItems, discountPercent).totalPayable),
        );
    };

    return (
        <div className="space-y-2.5">
            <div className="space-y-2">
                {lineItems.map((item, index) => (
                    <div
                        key={item.id}
                        className="rounded-lg border border-border bg-background/60 p-2.5"
                    >
                        <div className="flex items-start gap-2">
                            <input
                                type="text"
                                value={item.name}
                                onChange={(event) =>
                                    updateLineItem(item.id, { name: event.target.value })
                                }
                                placeholder={`Service ${index + 1}`}
                                aria-label={`Service ${index + 1} name`}
                                className={cn(compactInputClass, 'flex-1')}
                            />
                            <button
                                type="button"
                                onClick={() => removeLineItem(item.id)}
                                disabled={lineItems.length === 1}
                                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Remove service ${index + 1}`}
                            >
                                <Trash2 className="size-3.5" aria-hidden />
                            </button>
                        </div>
                        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_5.5rem_auto] items-end gap-2">
                            <label className="min-w-0 text-[11px] text-muted-foreground">
                                Fee / day
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.rate}
                                    onChange={(event) =>
                                        updateLineItem(item.id, { rate: event.target.value })
                                    }
                                    aria-label={`Service ${index + 1} fee per day`}
                                    className={cn(compactInputClass, 'mt-1')}
                                />
                            </label>
                            <label className="text-[11px] text-muted-foreground">
                                Days
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={item.days}
                                    onChange={(event) =>
                                        updateLineItem(item.id, { days: event.target.value })
                                    }
                                    aria-label={`Service ${index + 1} days`}
                                    className={cn(compactInputClass, 'mt-1')}
                                />
                            </label>
                            <p className="pb-1.5 text-end text-sm font-medium text-foreground">
                                {formatMoney(calculateLineItemAmount(item), currency)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addLineItem}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-secondary/40 hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <Plus className="size-3.5" aria-hidden />
                Add service
            </button>

            <div className="space-y-1.5 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-sm">
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
                        className={cn(compactInputClass, 'w-20 text-end')}
                    />
                </div>
                {totals.discount > 0 ? (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-foreground">
                            -{formatMoney(totals.discount, currency)}
                        </span>
                    </div>
                ) : null}
                <div className="flex items-center justify-between gap-4 border-t border-border pt-1.5">
                    <span className="text-sm font-semibold text-foreground">Total payable</span>
                    <span className="font-heading text-base font-semibold text-foreground">
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
