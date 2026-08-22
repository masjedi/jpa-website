import { ArrowRight } from 'lucide-react';

import {
    contentRecordStatusStyles,
    type ContentRecordViewModel,
} from '@/components/admin/contentRecordViewModel';
import { isRichTextHtml } from '@/lib/richText';
import { cn } from '@/lib/utils';

interface ContentRecordViewProps {
    model: ContentRecordViewModel;
    className?: string;
}

const richTextClass =
    'text-sm leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:ps-5';

export function ContentRecordView({ model, className }: ContentRecordViewProps) {
    const usesRichBody = Boolean(model.bodyHtml && isRichTextHtml(model.bodyHtml));
    const hasSections = Boolean(model.sections && model.sections.length > 0);
    const hasHighlights = Boolean(model.highlights && model.highlights.length > 0);
    const hasImage = Boolean(model.imageUrl);
    const shouldShowCardPreview =
        model.showCardPreview ?? Boolean(model.cardEyebrow && hasImage);
    const shouldShowContentSection =
        model.showContentSection ??
        Boolean(usesRichBody || hasSections || model.bodyPlain || hasHighlights);

    return (
        <div className={cn('space-y-5', className)}>
            {hasImage ? (
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="relative aspect-[16/10] bg-surface-muted sm:aspect-[21/9]">
                        <img
                            src={model.imageUrl}
                            alt={model.imageAlt ?? ''}
                            className="size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        {model.badgeLabel ? (
                            <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
                                {model.badgeLabel}
                            </span>
                        ) : null}
                    </div>

                    <div className="space-y-3 p-4 sm:p-5">
                        <div className="flex flex-wrap items-center gap-2">
                            {model.status ? (
                                <span
                                    className={cn(
                                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                                        contentRecordStatusStyles[model.status],
                                    )}
                                >
                                    {model.status}
                                </span>
                            ) : null}
                        </div>

                        <div>
                            <h3 className="font-heading text-xl font-semibold text-foreground">
                                {model.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {model.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <section aria-label="Homepage preview">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Homepage preview
                    </p>
                    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-brand-deep p-6 text-center sm:p-8">
                        {model.badgeLabel ? (
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-on-surface/65">
                                {model.badgeLabel}
                            </p>
                        ) : null}
                        <h3 className="mt-5 font-heading text-2xl font-semibold leading-tight text-brand-on-surface sm:text-3xl">
                            {model.title}
                        </h3>
                        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-on-surface/75 sm:text-base">
                            {model.subtitle}
                        </p>
                        {model.status ? (
                            <span
                                className={cn(
                                    'mt-5 inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                                    contentRecordStatusStyles[model.status],
                                )}
                            >
                                {model.status}
                            </span>
                        ) : null}
                    </div>
                </section>
            )}

            {shouldShowCardPreview ? (
                <section aria-label="Card preview">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Card preview
                    </p>
                    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                        <div className="relative aspect-[3/2] bg-surface-muted">
                            <img
                                src={model.imageUrl}
                                alt=""
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                            <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                                {model.cardEyebrow}
                            </span>
                        </div>
                        <div className="p-4">
                            <p className="font-heading text-base font-semibold text-foreground">
                                {model.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {model.subtitle}
                            </p>
                            {model.cardCtaLabel ? (
                                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-secondary">
                                    <span>{model.cardCtaLabel}</span>
                                    <ArrowRight className="size-3.5" aria-hidden />
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {model.metaFields.length > 0 ? (
                <section aria-label="Record metadata">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Details
                    </p>
                    <dl className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
                        {model.metaFields.map((field) => (
                            <div
                                key={field.id}
                                className="grid gap-1 px-4 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
                            >
                                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                    {field.label}
                                </dt>
                                <dd className="text-sm text-foreground">{field.value || '—'}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}

            {shouldShowContentSection ? (
                <section aria-label="Content body">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Content
                </p>

                <div className="mt-2 rounded-xl border border-border bg-surface p-4 sm:p-5">
                    {usesRichBody ? (
                        <div
                            className={richTextClass}
                            dangerouslySetInnerHTML={{ __html: model.bodyHtml ?? '' }}
                        />
                    ) : null}

                    {!usesRichBody && hasSections ? (
                        <div className="space-y-5">
                            {model.sections?.map((section) => (
                                <div key={section.id}>
                                    <h4 className="font-heading text-base font-semibold text-foreground">
                                        {section.heading}
                                    </h4>
                                    <div className="mt-2 space-y-2">
                                        {section.paragraphs.map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                className="text-sm leading-relaxed text-muted-foreground"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {!usesRichBody && !hasSections && model.bodyPlain ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {model.bodyPlain}
                        </p>
                    ) : null}

                    {!usesRichBody && hasHighlights ? (
                        <div className="mt-4 border-t border-border pt-4">
                            <h4 className="font-heading text-sm font-semibold text-foreground">
                                Highlights
                            </h4>
                            <ul className="mt-2 space-y-2">
                                {model.highlights?.map((highlight) => (
                                    <li
                                        key={highlight}
                                        className="text-sm leading-relaxed text-muted-foreground"
                                    >
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {!usesRichBody &&
                    !hasSections &&
                    !model.bodyPlain &&
                    !hasHighlights ? (
                        <p className="text-sm text-muted-foreground">No content yet.</p>
                    ) : null}
                </div>
            </section>
            ) : null}

            {model.relatedItems && model.relatedItems.length > 0 ? (
                <section aria-label={model.relatedItemsTitle ?? 'Related items'}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {model.relatedItemsTitle ?? 'Related items'}
                    </p>
                    <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
                        {model.relatedItems.map((item) => (
                            <li key={item.id} className="px-4 py-3">
                                <p className="text-sm font-medium text-foreground">{item.title}</p>
                                {item.meta ? (
                                    <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </div>
    );
}
