export function isRichTextHtml(value: string): boolean {
    return /<[a-z][\s\S]*>/i.test(value.trim());
}

export function decodeHtmlEntities(value: string): string {
    if (typeof document === 'undefined') {
        return value
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&');
    }

    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;

    return textarea.value;
}

/**
 * Normalize stored admin rich text for editing or viewing.
 */
export function normalizeRichHtml(value: string): string {
    const trimmed = value.trim();

    if (trimmed === '') {
        return '';
    }

    if (trimmed.includes('&lt;') && trimmed.includes('&gt;')) {
        return decodeHtmlEntities(trimmed);
    }

    return trimmed;
}

export function stripHtml(value: string): string {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
