import { useState } from 'react';

import { BookNowChoiceDialog } from '@/components/public/BookNowChoiceDialog';
import { useTranslations } from '@/hooks/use-translations';

interface BookNowButtonProps {
    className?: string;
    onOpen?: () => void;
}

export function BookNowButton({ className, onOpen }: BookNowButtonProps) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslations();

    return (
        <>
            <button
                type="button"
                className={className}
                onClick={() => {
                    onOpen?.();
                    setOpen(true);
                }}
            >
                {t('buttons.bookNow')}
            </button>
            <BookNowChoiceDialog isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
}
