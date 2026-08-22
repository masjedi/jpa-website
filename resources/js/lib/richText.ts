export function isRichTextHtml(value: string): boolean {
    return /<[a-z][\s\S]*>/i.test(value.trim());
}

export function stripHtml(value: string): string {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
