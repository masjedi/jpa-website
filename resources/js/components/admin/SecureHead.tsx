import { Head } from '@inertiajs/react';

import { SECURE_TAB_TITLE } from '@/lib/secureTabTitle';

export function SecureHead() {
    return <Head title={SECURE_TAB_TITLE} />;
}
