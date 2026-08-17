import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
    applyAppearance,
    getStoredAppearance,
    resolveAppearance,
    setAppearance as persistAppearance,
    toggleAppearance as flipAppearance,
    type AppearancePreference,
    type ResolvedAppearance,
} from '@/lib/appearance';

interface AppearanceContextValue {
    preference: AppearancePreference;
    resolved: ResolvedAppearance;
    setAppearance: (preference: AppearancePreference) => void;
    toggleAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
    const [preference, setPreference] = useState<AppearancePreference>(() => getStoredAppearance());
    const [resolved, setResolved] = useState<ResolvedAppearance>(() => resolveAppearance(getStoredAppearance()));

    useEffect(() => {
        setResolved(applyAppearance(preference));
    }, [preference]);

    useEffect(() => {
        if (preference !== 'system') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            setResolved(applyAppearance('system'));
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [preference]);

    const setAppearance = useCallback((nextPreference: AppearancePreference) => {
        setPreference(nextPreference);
        setResolved(persistAppearance(nextPreference));
    }, []);

    const toggleAppearance = useCallback(() => {
        const nextResolved = flipAppearance();
        const nextPreference: AppearancePreference = nextResolved === 'dark' ? 'dark' : 'light';

        setPreference(nextPreference);
        setResolved(nextResolved);
    }, []);

    const value = useMemo(
        () => ({
            preference,
            resolved,
            setAppearance,
            toggleAppearance,
        }),
        [preference, resolved, setAppearance, toggleAppearance],
    );

    return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
    const context = useContext(AppearanceContext);

    if (!context) {
        throw new Error('useAppearance must be used within an AppearanceProvider.');
    }

    return context;
}
