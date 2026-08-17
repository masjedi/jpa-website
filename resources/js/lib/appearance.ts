export type AppearancePreference = 'system' | 'light' | 'dark';

export type ResolvedAppearance = 'light' | 'dark';

export const APPEARANCE_STORAGE_KEY = 'appearance';

const validPreferences: AppearancePreference[] = ['system', 'light', 'dark'];

export function isAppearancePreference(value: string | null): value is AppearancePreference {
    return value !== null && validPreferences.includes(value as AppearancePreference);
}

export function getStoredAppearance(): AppearancePreference {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);

    return isAppearancePreference(stored) ? stored : 'system';
}

export function getSystemAppearance(): ResolvedAppearance {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveAppearance(preference: AppearancePreference): ResolvedAppearance {
    if (preference === 'system') {
        return getSystemAppearance();
    }

    return preference;
}

export function applyAppearance(preference: AppearancePreference): ResolvedAppearance {
    const resolved = resolveAppearance(preference);

    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', resolved === 'dark');
    }

    return resolved;
}

export function setAppearance(preference: AppearancePreference): ResolvedAppearance {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(APPEARANCE_STORAGE_KEY, preference);
    }

    return applyAppearance(preference);
}

export function toggleAppearance(): ResolvedAppearance {
    const resolved = applyAppearance(getStoredAppearance());

    return setAppearance(resolved === 'dark' ? 'light' : 'dark');
}
