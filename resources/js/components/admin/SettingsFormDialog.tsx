import { useId } from 'react';

import { SettingsEntityForm } from '@/components/admin/SettingsEntityForm';
import type { AdminSiteSettings, LogoSpec, SettingsSubmitPayload } from '@/components/admin/settingsForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { primaryTranslation } from '@/lib/translations';

interface SettingsFormDialogProps {
    open: boolean;
    settings: AdminSiteSettings;
    logoSpec: LogoSpec;
    onClose: () => void;
    onSubmit: (payload: SettingsSubmitPayload) => void | Promise<void>;
}

export function SettingsFormDialog({
    open,
    settings,
    logoSpec,
    onClose,
    onSubmit,
}: SettingsFormDialogProps) {
    const formId = useId();
    const resetKey = `${primaryTranslation(settings.brandName)}-${settings.contactEmail}-${settings.logoColor}`;

    const handleSubmit = async (payload: SettingsSubmitPayload) => {
        await onSubmit(payload);
    };

    return (
        <DataTableDialog
            open={open}
            title="Edit site settings"
            description="Update branding, contact details, social links, and logo assets."
            onClose={onClose}
            size="lg"
        >
            {open ? (
                <SettingsEntityForm
                    key={resetKey}
                    formId={formId}
                    settings={settings}
                    logoSpec={logoSpec}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </DataTableDialog>
    );
}
