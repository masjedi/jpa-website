import type { ReactNode } from 'react';

import { AdminLayout } from '@/layouts/AdminLayout';

export function withAdminLayout(title: string) {
    return (page: ReactNode) => <AdminLayout title={title}>{page}</AdminLayout>;
}
