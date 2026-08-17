import { Clock } from 'lucide-react';

import { formatShortDuration } from '@/components/sections/tours/tourDisplay';

interface TourOfferBadgesProps {
    durationDays: number;
    durationLabel?: string;
    highlight?: string;
}

export function TourOfferBadges({
    durationDays,
    durationLabel,
    highlight,
}: TourOfferBadgesProps) {
    const duration = formatShortDuration(durationDays, durationLabel);

    return (
        <div className="absolute left-2.5 top-2.5 z-10 flex max-w-[calc(100%-1.25rem)] flex-col items-start gap-1">
            <span
                className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary/95 px-2 py-0.5 text-[11px] font-semibold leading-none text-primary-foreground shadow-sm backdrop-blur-sm"
                title={durationLabel ?? duration}
            >
                <Clock className="size-3 shrink-0" aria-hidden />
                <span className="truncate">{duration}</span>
            </span>
            {highlight ? (
                <span
                    className="inline-block max-w-full truncate rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold leading-none text-accent-foreground shadow-sm"
                    title={highlight}
                >
                    {highlight}
                </span>
            ) : null}
        </div>
    );
}
