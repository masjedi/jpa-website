import { createContext, useContext, type ReactNode } from 'react';

import { useBookingTranslations } from '@/hooks/use-booking-translations';

type BookingTranslations = ReturnType<typeof useBookingTranslations>;

const BookingTranslationContext = createContext<BookingTranslations | null>(null);

export function BookingTranslationProvider({ children }: { children: ReactNode }) {
    const value = useBookingTranslations();

    return (
        <BookingTranslationContext.Provider value={value}>{children}</BookingTranslationContext.Provider>
    );
}

export function useBookingTranslationContext(): BookingTranslations {
    const context = useContext(BookingTranslationContext);

    if (context === null) {
        throw new Error('useBookingTranslationContext must be used within BookingTranslationProvider');
    }

    return context;
}
