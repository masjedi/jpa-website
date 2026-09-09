import { Link } from '@inertiajs/react';
import { FileText, Pencil } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { TranslationLocaleBadges } from '@/components/admin/TranslationLocaleBadges';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { primaryTranslation } from '@/lib/translations';
import type { AdminLegalPageSummary } from '@/types/legalPage';

interface LegalPagesProps {
    pages: AdminLegalPageSummary[];
}

export default function LegalPages({ pages }: LegalPagesProps) {
    return (
        <div className="space-y-4">
            <AdminSectionHeader
                eyebrow="Public website"
                title="Legal pages"
                description="Edit Privacy Policy and Terms and Conditions content for each language."
                icon={FileText}
            />

            <div className="grid gap-4 lg:grid-cols-2">
                {pages.map((page) => (
                    <AdminSectionPanel
                        key={page.key}
                        title={page.label}
                        description={`${page.sectionCount} section${page.sectionCount === 1 ? '' : 's'} · Updated ${page.updated || '—'}`}
                    >
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {primaryTranslation(page.title)}
                                </p>
                                <TranslationLocaleBadges value={page.title} />
                            </div>

                            <Link
                                href={`/admin/legal-pages/${page.key}/edit`}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
                            >
                                <Pencil className="size-4" aria-hidden />
                                Edit page
                            </Link>
                        </div>
                    </AdminSectionPanel>
                ))}
            </div>
        </div>
    );
}

LegalPages.layout = withAdminLayout('Legal pages');
