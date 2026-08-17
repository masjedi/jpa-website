import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { Footer } from '@/components/public/Footer';
import { InquiryCtaBand } from '@/components/public/InquiryCtaBand';
import { Navbar } from '@/components/public/Navbar';
import { cn } from '@/lib/utils';
import '@/types/inertia';

interface PublicLayoutProps {
    children: ReactNode;
    transparentHeader?: boolean;
}

export function PublicLayout({ children, transparentHeader = false }: PublicLayoutProps) {
    const { locale, direction } = usePage().props;

    return (
        <div
            lang={locale}
            dir={direction}
            className="flex min-h-screen flex-col bg-background text-start text-foreground"
        >
            <Navbar transparent={transparentHeader} />
            <main className={cn('w-full flex-1', !transparentHeader && 'pt-24')}>{children}</main>
            <InquiryCtaBand />
            <div className="h-3 bg-background" aria-hidden />
            <Footer />
        </div>
    );
}
