import { translationCompletion } from '@/lib/translations';
import type { TranslatedString } from '@/types/locale';

interface TranslationLocaleBadgesProps {
    value: TranslatedString;
    className?: string;
}

export function TranslationLocaleBadges({ value, className }: TranslationLocaleBadgesProps) {
    return (
        <div className={className ?? 'mt-2 flex flex-wrap gap-1.5'}>
            {Object.entries(translationCompletion(value)).map(([locale, complete]) => (
                <span
                    key={locale}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                        complete
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-surface-muted text-muted-foreground'
                    }`}
                >
                    {locale}
                </span>
            ))}
        </div>
    );
}
