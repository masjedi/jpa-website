import { Link } from '@inertiajs/react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { AdminNavbarFeedItem } from '@/types/inertia';

interface AdminNavbarDropdownProps {
    label: string;
    title: string;
    icon: ReactNode;
    badge?: number;
    items: AdminNavbarFeedItem[];
    emptyLabel?: string;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    footerHref: string;
    footerLabel: string;
}

export function AdminNavbarDropdown({
    label,
    title,
    icon,
    badge,
    items,
    emptyLabel = 'Nothing here yet',
    isOpen,
    onToggle,
    onClose,
    footerHref,
    footerLabel,
}: AdminNavbarDropdownProps) {
    const menuId = useId();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <div ref={containerRef} className="relative shrink-0">
            <button
                type="button"
                aria-label={label}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls={menuId}
                onClick={onToggle}
                className={cn(
                    'relative inline-flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    isOpen && 'border-secondary/35 bg-surface-muted text-secondary',
                )}
            >
                {icon}
                {(badge ?? 0) > 0 ? (
                    <span
                        aria-hidden
                        className="absolute -end-1.5 -top-1.5 z-10 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-foreground shadow-sm ring-2 ring-surface"
                    >
                        {badge! > 9 ? '9+' : badge}
                    </span>
                ) : null}
            </button>

            {isOpen ? (
                <div
                    id={menuId}
                    role="menu"
                    aria-label={title}
                    className="absolute end-0 top-[calc(100%+0.375rem)] z-50 w-[15.5rem] overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
                >
                    <span
                        aria-hidden
                        className="absolute -top-1.5 end-3 size-3 rotate-45 border-s border-t border-border bg-surface"
                    />

                    <div className="px-3 py-2">
                        <p className="text-xs font-semibold text-foreground">{title}</p>
                    </div>

                    <ul className="max-h-52 divide-y divide-border overflow-y-auto border-t border-border">
                        {items.length === 0 ? (
                            <li className="px-3 py-4 text-center text-[11px] text-muted-foreground">
                                {emptyLabel}
                            </li>
                        ) : (
                            items.map((item) => (
                                <li key={item.id}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            role="menuitem"
                                            onClick={onClose}
                                            className="block px-3 py-2 transition-colors hover:bg-surface-muted/80 focus-visible:bg-surface-muted/80 focus-visible:outline-none"
                                        >
                                            <FeedItemContent item={item} />
                                        </Link>
                                    ) : (
                                        <div className="px-3 py-2">
                                            <FeedItemContent item={item} />
                                        </div>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="border-t border-border bg-surface-muted/50 px-3 py-2">
                        <Link
                            href={footerHref}
                            onClick={onClose}
                            className="text-xs font-medium text-secondary transition-colors hover:text-secondary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {footerLabel}
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function FeedItemContent({ item }: { item: AdminNavbarFeedItem }) {
    return (
        <div className="flex items-start gap-2">
            {item.unread ? (
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />
            ) : (
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-transparent" aria-hidden />
            )}
            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                    {item.description}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{item.time}</p>
            </div>
        </div>
    );
}
