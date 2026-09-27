import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { AdminChatWidget } from '@/components/admin/AdminChatWidget';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SecureHead } from '@/components/admin/SecureHead';
import '@/types/inertia';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
    const { url } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0, left: 0 });
    }, [url]);

    return (
        <div className="h-dvh overflow-hidden bg-background text-foreground">
            <SecureHead />
            <AdminSidebar
                currentPath={url}
                mobileOpen={mobileNavOpen}
                onMobileClose={() => setMobileNavOpen(false)}
            />

            <div className="flex h-dvh flex-col overflow-hidden lg:ps-72">
                <AdminNavbar title={title} onMenuToggle={() => setMobileNavOpen(true)} />
                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5"
                >
                    {children}
                </main>
                <AdminChatWidget />
            </div>
        </div>
    );
}
