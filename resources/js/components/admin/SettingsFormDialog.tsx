import { useId } from 'react';

import { SettingsEntityForm } from '@/components/admin/SettingsEntityForm';
import type { LogoSpec, SettingsSubmitPayload } from '@/components/admin/settingsForm';
import { DataTableDialog } from '@/components/admin/DataTableDialog';
import type { SiteSettings } from '@/components/public/brand';

interface SettingsFormDialogProps {
    open: boolean;
    settings: SiteSettings;
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
    const resetKey = `${settings.brandName}-${settings.contactEmail}-${settings.logoColor}`;

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
