import {
    calculateInvoiceTotals,
    createEmptyLineItem,
    type InvoiceLineItemFormRow,
} from '@/components/admin/invoiceCalculations';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export type InvoiceStatusValue = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceLineItem {
    name: string;
    rate: string;
    days: string;
    amount: string;
    amountValue: string;
}

export interface InvoiceTotalsDetail {
    subtotal: string;
    subtotalValue: string;
    discount: string;
    discountValue: string;
    totalPayable: string;
    totalPayableValue: string;
}

export interface InvoiceFormValues {
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    tourReference: string;
    issuedOn: string;
    dueOn: string;
    currency: 'USD' | 'EUR' | 'GBP' | 'AFN';
    discountPercent: string;
    amount: string;
    status: InvoiceStatusValue;
    lineItems: InvoiceLineItemFormRow[];
    notes: string;
}

export interface InvoiceDetail {
    id: number;
    number: string;
    client: string;
    clientEmail: string;
    clientAddress: string;
    tour: string;
    amount: string;
    amountValue: string;
    currency: string;
    status: InvoiceStatus;
    statusValue: InvoiceStatusValue;
    issued: string;
    issuedOn: string;
    dueOn: string;
    dueLabel: string;
    discountPercent: string;
    lineItems: InvoiceLineItem[];
    totals: InvoiceTotalsDetail;
    notes: string;
    createdAt: string;
    verificationUrl: string;
    verificationExpiresLabel: string;
    verificationActive: boolean;
}

export const invoiceStatusOptions: readonly { label: InvoiceStatus; value: InvoiceStatusValue }[] = [
    { label: 'Draft', value: 'draft' },
    { label: 'Sent', value: 'sent' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
] as const;

export const invoiceCurrencyOptions = ['USD', 'EUR', 'GBP', 'AFN'] as const;

export function createEmptyInvoiceFormValues(): InvoiceFormValues {
    const today = new Date().toISOString().slice(0, 10);

    return {
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        tourReference: '',
        issuedOn: today,
        dueOn: '',
        currency: 'USD',
        discountPercent: '0',
        amount: '0.00',
        status: 'draft',
        lineItems: [createEmptyLineItem()],
        notes: '',
    };
}

export function invoiceToFormValues(invoice: InvoiceDetail): InvoiceFormValues {
    return {
        clientName: invoice.client,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        tourReference: invoice.tour,
        issuedOn: invoice.issuedOn,
        dueOn: invoice.dueOn,
        currency: invoice.currency as InvoiceFormValues['currency'],
        discountPercent: invoice.discountPercent || '0',
        amount: invoice.amountValue,
        status: invoice.statusValue,
        lineItems:
            invoice.lineItems.length > 0
                ? invoice.lineItems.map((item) => ({
                      id: crypto.randomUUID(),
                      name: item.name,
                      rate: item.rate,
                      days: item.days || '1',
                  }))
                : [createEmptyLineItem()],
        notes: invoice.notes,
    };
}

export type InvoiceFormField =
    | 'clientName'
    | 'clientEmail'
    | 'clientAddress'
    | 'tourReference'
    | 'issuedOn'
    | 'dueOn'
    | 'currency'
    | 'discountPercent'
    | 'amount'
    | 'status'
    | 'lineItems'
    | 'notes';

export type InvoiceFormErrors = Partial<Record<InvoiceFormField, string>>;

export function validateInvoiceFormValues(values: InvoiceFormValues): InvoiceFormErrors {
    const errors: InvoiceFormErrors = {};

    if (!values.clientName.trim()) {
        errors.clientName = 'Required';
    }

    if (!values.clientEmail.trim()) {
        errors.clientEmail = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.clientEmail.trim())) {
        errors.clientEmail = 'Enter a valid email';
    }

    if (!values.issuedOn) {
        errors.issuedOn = 'Required';
    }

    const hasValidLineItem = values.lineItems.some(
        (item) =>
            item.name.trim() !== '' &&
            item.rate.trim() !== '' &&
            !Number.isNaN(Number(item.rate)) &&
            item.days.trim() !== '' &&
            !Number.isNaN(Number(item.days)) &&
            Number(item.days) > 0,
    );

    if (!hasValidLineItem) {
        errors.lineItems = 'Add at least one service with a name, fee and number of days.';
    }

    const totals = calculateInvoiceTotals(values.lineItems, values.discountPercent);

    if (totals.totalPayable < 0) {
        errors.amount = 'Total payable cannot be negative.';
    }

    return errors;
}

export function buildInvoicePayload(values: InvoiceFormValues): Record<string, unknown> {
    const totals = calculateInvoiceTotals(values.lineItems, values.discountPercent);

    return {
        client_name: values.clientName.trim(),
        client_email: values.clientEmail.trim(),
        client_address: values.clientAddress.trim(),
        tour_reference: values.tourReference.trim(),
        issued_on: values.issuedOn,
        due_on: values.dueOn,
        currency: values.currency,
        discount_percent: values.discountPercent.trim() || '0',
        amount: totals.totalPayable.toFixed(2),
        status: values.status,
        line_items: values.lineItems
            .filter((item) => item.name.trim() !== '')
            .map((item) => ({
                name: item.name.trim(),
                rate: item.rate.trim() || '0',
                days: item.days.trim() || '1',
            })),
        notes: values.notes.trim(),
    };
}
