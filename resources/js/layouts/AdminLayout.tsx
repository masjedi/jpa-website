import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import '@/types/inertia';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
    const { url } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AdminSidebar
                currentPath={url}
                mobileOpen={mobileNavOpen}
                onMobileClose={() => setMobileNavOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminNavbar title={title} onMenuToggle={() => setMobileNavOpen(true)} />
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
