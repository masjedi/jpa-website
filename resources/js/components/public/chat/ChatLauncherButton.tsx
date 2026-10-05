import { MessageCircle } from 'lucide-react';

import { useTranslations } from '@/hooks/use-translations';

export function ChatLauncherButton({
    isOpen,
    onToggle,
}: {
    isOpen: boolean;
    onToggle: () => void;
}) {
    const { t } = useTranslations();

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={t('chat.open')}
            className="fixed start-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_28px_rgba(7,23,34,0.28)] transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:start-6 sm:bottom-6 sm:size-16"
        >
            <MessageCircle className="size-7 sm:size-8" aria-hidden />
        </button>
    );
}
