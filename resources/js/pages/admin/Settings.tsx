import { Head } from '@inertiajs/react';
import { Globe, Palette, Settings as SettingsIcon, Shield } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { withAdminLayout } from '@/layouts/withAdminLayout';

const settingsGroups = [
    {
        title: 'Site identity',
        description: 'Brand name, contact details, and public footer information.',
        icon: Globe,
    },
    {
        title: 'Appearance',
        description: 'Theme defaults, accent usage, and localized layout preferences.',
        icon: Palette,
    },
    {
        title: 'Access & security',
        description: 'Administrator accounts, session policies, and audit preferences.',
        icon: Shield,
    },
] as const;

export default function Settings() {
    return (
        <>
            <Head title="Settings" />

            <div className="space-y-6">
                <AdminSectionHeader
                    eyebrow="Configuration"
                    title="Settings"
                    description="Manage global website settings, branding, localization readiness, and administrative preferences."
                    icon={SettingsIcon}
                />

                <div className="grid gap-4 lg:grid-cols-3">
                    {settingsGroups.map((group) => {
                        const Icon = group.icon;

                        return (
                            <AdminSectionPanel key={group.title} title={group.title} description={group.description}>
                                <div className="flex items-start gap-3">
                                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-4" aria-hidden />
                                    </span>
                                    <p className="text-sm text-muted-foreground">
                                        Configuration controls for this group will be added in a later phase.
                                    </p>
                                </div>
                            </AdminSectionPanel>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Settings.layout = withAdminLayout('Settings');
