import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { Footer } from '@/components/public/Footer';
import { Navbar } from '@/components/public/Navbar';
import { WhatsAppFloat } from '@/components/public/WhatsAppFloat';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import '@/types/inertia';

interface PublicLayoutProps {
    children: ReactNode;
    transparentHeader?: boolean;
}

export function PublicLayout({ children, transparentHeader = false }: PublicLayoutProps) {
    const { locale, direction } = usePage().props;
    const { t } = useTranslations();

    return (
        <div
            lang={locale}
            dir={direction}
            className="flex min-h-screen flex-col overflow-x-clip bg-background text-start text-foreground"
        >
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-focus"
            >
                {t('common.skipToContent')}
            </a>
            <Navbar transparent={transparentHeader} />
            <main
                id="main-content"
                tabIndex={-1}
                className={cn('w-full flex-1 outline-none', !transparentHeader && 'pt-24')}
            >
                {children}
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}
