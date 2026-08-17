import type { DepartureStatus } from '@/types/tours';

export function formatShortDuration(
    durationDays: number,
    durationLabel?: string,
): string {
    if (durationDays > 0) {
        return durationDays === 1 ? '1 day' : `${durationDays} days`;
    }

    if (!durationLabel) {
        return 'Flexible';
    }

    const customMatch = durationLabel.match(/(\d+)\s*to\s*(\d+)/i);
    if (customMatch) {
        return `${customMatch[1]}–${customMatch[2]} days`;
    }

    return 'Flexible';
}

export function shortDepartureStatus(status: DepartureStatus): string {
    switch (status) {
        case 'Guaranteed':
            return 'Guaranteed';
        case 'Limited Availability':
            return 'Limited';
        case 'Almost Full':
            return 'Almost full';
        case 'Open for Inquiries':
            return 'Open';
        case 'On Request':
            return 'On request';
        default:
            return status;
    }
}
