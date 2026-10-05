import { Pencil } from 'lucide-react';

import { countConfiguredSocialLinks, normalizeSocialLinks, type AdminSiteSettings } from '@/components/admin/settingsForm';
import { primaryTranslation } from '@/lib/translations';

interface SettingsSummaryProps {
    settings: AdminSiteSettings;
    onEdit: () => void;
}

function SummaryBlock({
    label,
    title,
    preview,
}: {
    label: string;
    title: string;
    preview: string;
}) {
    return (
        <div className="rounded-lg border border-border/80 bg-background/60 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">{title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {preview}
            </p>
        </div>
    );
}

export function SettingsSummary({ settings, onEdit }: SettingsSummaryProps) {
    const configuredSocialCount = countConfiguredSocialLinks(
        normalizeSocialLinks(settings.socialLinks),
    );
    const mapsConfigured = settings.officeMapsHref.trim() !== '' || settings.officeMapsEmbedSrc.trim() !== '';

    return (
        <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <SummaryBlock
                    label="Brand"
                    title={primaryTranslation(settings.brandName)}
                    preview={settings.contactEmail}
                />
                <SummaryBlock
                    label="WhatsApp"
                    title={primaryTranslation(settings.whatsappDisplay)}
                    preview={settings.whatsappHref}
                />
                <SummaryBlock
                    label="Office"
                    title={primaryTranslation(settings.officeLocation)}
                    preview={mapsConfigured ? 'Maps link and embed configured' : 'Maps not configured yet'}
                />
            </div>

            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="rounded-lg border border-border/80 bg-background/60 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Social links
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                        {configuredSocialCount} of {normalizeSocialLinks(settings.socialLinks).length} configured
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {normalizeSocialLinks(settings.socialLinks)
                            .map((link) => link.label)
                            .join(' · ')}
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-background/60 px-3 py-2.5">
                    <div className="flex min-h-12 flex-1 items-center justify-center rounded-lg border border-border bg-surface-muted/50 px-3">
                        <img
                            src={settings.logoColor}
                            alt="Color logo"
                            className="h-8 w-auto max-w-[7rem] object-contain"
                        />
                    </div>
                    <div className="flex min-h-12 flex-1 items-center justify-center rounded-lg border border-border bg-brand-deep px-3">
                        <img
                            src={settings.logoWhite}
                            alt="White logo"
                            className="h-8 w-auto max-w-[7rem] object-contain"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end border-t border-border pt-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted sm:text-sm"
                >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit site settings
                </button>
            </div>
        </div>
    );
}
