import { Head } from '@inertiajs/react';
import { BookOpen, Plus } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { withAdminLayout } from '@/layouts/withAdminLayout';

export default function Articles() {
    return (
        <>
            <Head title="Articles" />

            <div className="space-y-6">
                <AdminSectionHeader
                    eyebrow="Content"
                    title="Articles"
                    description="Publish travel stories, cultural guides, and practical information for visitors exploring Afghanistan."
                    icon={BookOpen}
                    actions={
                        <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground opacity-70"
                        >
                            <Plus className="size-4" aria-hidden />
                            New article
                        </button>
                    }
                />

                <AdminSectionPanel
                    title="Editorial library"
                    description="Drafts, scheduled posts, and published articles will appear here."
                >
                    <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
                        <p className="font-heading text-base font-semibold text-foreground">
                            Article editor not connected yet
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            This section will support rich content editing, categories, and SEO fields for the
                            public articles pages.
                        </p>
                    </div>
                </AdminSectionPanel>
            </div>
        </>
    );
}

Articles.layout = withAdminLayout('Articles');
