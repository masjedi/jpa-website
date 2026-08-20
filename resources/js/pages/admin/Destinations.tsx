import { Head } from '@inertiajs/react';
import { Compass, Plus } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { withAdminLayout } from '@/layouts/withAdminLayout';

export default function Destinations() {
    return (
        <>
            <Head title="Destinations" />

            <div className="space-y-6">
                <AdminSectionHeader
                    eyebrow="Content"
                    title="Destinations"
                    description="Organize Afghan regions, travel highlights, safety notes, and destination detail pages shown on the public site."
                    icon={Compass}
                    actions={
                        <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground opacity-70"
                        >
                            <Plus className="size-4" aria-hidden />
                            New destination
                        </button>
                    }
                />

                <AdminSectionPanel
                    title="Destination catalog"
                    description="Regions, provinces, and featured places will be managed in this table."
                >
                    <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
                        <p className="font-heading text-base font-semibold text-foreground">
                            Destination management coming next
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            Use this area to curate destination stories, imagery, and linked tours once the
                            module is connected.
                        </p>
                    </div>
                </AdminSectionPanel>
            </div>
        </>
    );
}

Destinations.layout = withAdminLayout('Destinations');
