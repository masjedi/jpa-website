export function buildMailtoHref(email: string): string {
    const normalized = email.trim().replace(/^mailto:/i, '');

    if (!normalized) {
        return 'mailto:';
    }

    return `mailto:${normalized}`;
}

/**
 * Gmail compose URL — opens in a new browser tab (same behaviour as WhatsApp links).
 * mailto: alone does not reliably open a new tab in modern browsers.
 */
export function buildWebMailComposeHref(email: string): string {
    const address = email.trim().replace(/^mailto:/i, '');

    if (!address) {
        return 'https://mail.google.com/mail/';
    }

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(address)}`;
}
