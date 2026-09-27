/** Shared line limits so listing cards stay the same height in a grid. */
export const cardTitleClass = 'line-clamp-2 min-h-[2lh]';
export const cardSubtitleClass = 'line-clamp-2 min-h-[2lh]';
export const cardSummaryClass = 'line-clamp-2 min-h-[2lh]';
export const cardLineClass = 'line-clamp-1 min-h-[1lh]';

/** Stack price/meta above actions on narrow screens; row layout from sm up. */
export const cardFooterClass =
    'mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4';

export const cardFooterPrimaryClass =
    'min-w-0 text-sm font-semibold leading-snug text-foreground sm:flex-1';

export const cardFooterMetaClass = 'min-w-0 text-xs leading-snug text-muted-foreground sm:flex-1';

export const cardFooterActionsClass =
    'flex flex-wrap items-center gap-x-3 gap-y-2 sm:shrink-0 sm:justify-end';
