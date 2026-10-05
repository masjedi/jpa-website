export interface InvoiceLineItemFormRow {
    id: string;
    name: string;
    rate: string;
    days: string;
}

export interface InvoiceTotals {
    subtotal: number;
    discount: number;
    totalPayable: number;
}

function parseAmount(value: string): number {
    const parsed = Number.parseFloat(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateLineItemAmount(
    item: Pick<InvoiceLineItemFormRow, 'rate' | 'days'>,
): number {
    const amount = parseAmount(item.rate) * parseAmount(item.days);

    return Math.round(amount * 100) / 100;
}

export function calculateInvoiceTotals(
    lineItems: readonly InvoiceLineItemFormRow[],
    discountPercent: string,
): InvoiceTotals {
    const subtotal = Math.round(
        lineItems.reduce((sum, item) => sum + calculateLineItemAmount(item), 0) * 100,
    ) / 100;
    const discount = Math.round(subtotal * (parseAmount(discountPercent) / 100) * 100) / 100;
    const totalPayable = Math.round((subtotal - discount) * 100) / 100;

    return {
        subtotal,
        discount,
        totalPayable,
    };
}

export function createEmptyLineItem(): InvoiceLineItemFormRow {
    return {
        id: crypto.randomUUID(),
        name: '',
        rate: '',
        days: '1',
    };
}

export function formatMoneyInput(amount: number): string {
    return amount.toFixed(2);
}

export function formatMoney(amount: number, currency: string): string {
    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    switch (currency) {
        case 'USD':
            return `$${formatted}`;
        case 'EUR':
            return `€${formatted}`;
        case 'GBP':
            return `£${formatted}`;
        case 'AFN':
            return `${formatted} AFN`;
        default:
            return `${currency} ${formatted}`;
    }
}
