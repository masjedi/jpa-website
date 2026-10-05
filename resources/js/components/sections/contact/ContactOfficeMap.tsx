import { ArrowUpRight, MapPin } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function ContactOfficeMap() {
    const { officeLocation, officeMapsHref, officeMapsEmbedSrc } = useSiteSettings();

    return (
        <FadeIn className="mt-10 sm:mt-12" y={20} duration={0.55}>
            <section aria-labelledby="contact-map-heading" className="text-start">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Find us
                        </p>
                        <h2
                            id="contact-map-heading"
                            className="font-heading mt-2 text-2xl font-semibold text-foreground"
                        >
                            Office location
                        </h2>
                        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                            {officeLocation}
                        </p>
                    </div>
                    <a
                        href={officeMapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-secondary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Open in Google Maps
                        <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                </div>

                <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:aspect-[21/9]">
                    <iframe
                        title={`Google Maps — ${officeLocation}`}
                        src={officeMapsEmbedSrc}
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>
        </FadeIn>
    );
}
