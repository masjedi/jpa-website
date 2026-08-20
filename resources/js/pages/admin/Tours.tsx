import { Head } from '@inertiajs/react';
import { Map, Plus } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { withAdminLayout } from '@/layouts/withAdminLayout';

export default function Tours() {
    return (
        <>
            <Head title="Tours" />

            <div className="space-y-6">
                <AdminSectionHeader
                    eyebrow="Content"
                    title="Tours"
                    description="Create and manage tour itineraries, departure windows, inclusions, and public-facing tour pages."
                    icon={Map}
                    actions={
                        <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground opacity-70"
                        >
                            <Plus className="size-4" aria-hidden />
                            New tour
                        </button>
                    }
                />

                <AdminSectionPanel
                    title="Tour library"
                    description="Tour records, drafts, and publishing controls will be listed here."
                >
                    <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
                        <p className="font-heading text-base font-semibold text-foreground">
                            No tours connected yet
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            This section is ready for the tours module. You will be able to add itineraries,
                            attach destinations, and manage inquiry CTAs from here.
                        </p>
                    </div>
                </AdminSectionPanel>
            </div>
        </>
    );
}

Tours.layout = withAdminLayout('Tours');
