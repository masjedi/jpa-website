import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

export type TranslationValue = string | TranslationTree;

export interface TranslationTree {
    [key: string]: TranslationValue;
}

export type TranslateParams = Record<string, string | number>;

function resolvePath(tree: TranslationTree, key: string): string | undefined {
    const segments = key.split('.');
    let current: TranslationValue | undefined = tree;

    for (const segment of segments) {
        if (typeof current !== 'object' || current === null || !(segment in current)) {
            return undefined;
        }

        current = current[segment];
    }

    return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params?: TranslateParams): string {
    if (!params) {
        return template;
    }

    return Object.entries(params).reduce(
        (result, [name, value]) => result.replaceAll(`:${name}`, String(value)),
        template,
    );
}

export function useTranslations() {
    const { translations } = usePage().props;

    const t = useCallback(
        (key: string, params?: TranslateParams): string => {
            const resolved = resolvePath(translations, key);

            if (resolved === undefined) {
                return key;
            }

            return interpolate(resolved, params);
        },
        [translations],
    );

    return { t };
}
