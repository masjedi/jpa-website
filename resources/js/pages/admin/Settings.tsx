import { router, usePage } from '@inertiajs/react';
import { Globe, Palette, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { SettingsFormDialog } from '@/components/admin/SettingsFormDialog';
import { SettingsSummary } from '@/components/admin/SettingsSummary';
import {
    buildSettingsFormData,
    type AdminSiteSettings,
    type LogoSpec,
    type SettingsSubmitPayload,
} from '@/components/admin/settingsForm';
import { primaryTranslation } from '@/lib/translations';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface SettingsPageProps {
    settings: AdminSiteSettings;
    logoSpec: LogoSpec;
}

const comingSoonGroups = [
    {
        title: 'Appearance',
        description: 'Theme defaults, accent usage, and localized layout preferences.',
        icon: Palette,
    },
] as const;

export default function Settings({ settings, logoSpec }: SettingsPageProps) {
    const { flash } = usePage().props;
    const [editorOpen, setEditorOpen] = useState(false);

    const handleSaveSettings = (payload: SettingsSubmitPayload) =>
        new Promise<void>((resolve, reject) => {
            router.post('/admin/settings', buildSettingsFormData(payload), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setEditorOpen(false);
                    resolve();
                },
                onError: (serverErrors) => reject(serverErrors),
            });
        });

    return (
        <>
            <div className="space-y-4">
                {flash.success ? (
                    <div
                        role="status"
                        className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                    >
                        {flash.success}
                    </div>
                ) : null}

                <AdminSectionHeader
                    eyebrow="Configuration"
                    title="Settings"
                    description="Manage global website settings, branding, and contact details used across the public site."
                    icon={SettingsIcon}
                />

                <AdminSectionPanel
                    title="Site identity"
                    description="Branding, contact channels, social links, and logo assets."
                >
                    <SettingsSummary settings={settings} onEdit={() => setEditorOpen(true)} />
                </AdminSectionPanel>

                <AdminSectionPanel
                    title="Planned settings"
                    description="Additional configuration groups scheduled for a later phase."
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        {comingSoonGroups.map((group) => {
                            const Icon = group.icon;

                            return (
                                <div
                                    key={group.title}
                                    className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-surface-muted/20 px-3 py-3"
                                >
                                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="size-4" aria-hidden />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground">{group.title}</p>
                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                            {group.description}
                                        </p>
                                        <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                            <Globe className="size-3" aria-hidden />
                                            Coming soon
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AdminSectionPanel>
            </div>

            <SettingsFormDialog
                open={editorOpen}
                settings={settings}
                logoSpec={logoSpec}
                onClose={() => setEditorOpen(false)}
                onSubmit={handleSaveSettings}
            />
        </>
    );
}

Settings.layout = withAdminLayout('Settings');
