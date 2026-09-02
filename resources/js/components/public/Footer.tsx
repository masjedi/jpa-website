import { Link } from '@inertiajs/react';

import { AnimatedAxisDivider } from '@/components/motion/AnimatedAxisDivider';
import { BrandLogo, brandLogoVariantForTheme } from '@/components/public/BrandLogo';
import { FooterNewsletter } from '@/components/public/FooterNewsletter';
import type { SocialLink } from '@/components/public/brand';
import { socialIconComponents } from '@/components/public/SocialIcons';
import { useAppearance } from '@/hooks/use-appearance';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { usePublicNavigation } from '@/hooks/use-public-navigation';
import { useTranslations } from '@/hooks/use-translations';
import {
    isInertiaPageLink,
    type PublicNavLink,
} from '@/components/public/navigation';
import { cn } from '@/lib/utils';

const linkClassName =
    'text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

function FooterLink({ link }: { link: PublicNavLink }) {
    if (isInertiaPageLink(link.href)) {
        return (
            <Link href={link.href} className={linkClassName}>
                {link.label}
            </Link>
        );
    }

    return (
        <a href={link.href} className={linkClassName}>
            {link.label}
        </a>
    );
}

function FooterLinkGroup({
    title,
    links,
}: {
    title: string;
    links: readonly PublicNavLink[];
}) {
    return (
        <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <ul className="mt-4 space-y-3">
                {links.map((link) => (
                    <li key={link.href}>
                        <FooterLink link={link} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialIconLink({ link }: { link: SocialLink }) {
    const { t } = useTranslations();
    const Icon =
        socialIconComponents[link.label as keyof typeof socialIconComponents] ??
        socialIconComponents.Instagram;

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.followOn', { label: link.label })}
            title={link.label}
            className="text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
            <Icon className="size-5" aria-hidden />
        </a>
    );
}

export function Footer() {
    const year = new Date().getFullYear();
    const { resolved } = useAppearance();
    const logoVariant = brandLogoVariantForTheme(resolved === 'dark');
    const { brandName, socialLinks } = useSiteSettings();
    const { t } = useTranslations();
    const { exploreLinks, companyLinks, helpLinks } = usePublicNavigation();

    const travelHelpLinks = helpLinks.filter(
        (link) => link.href !== '/privacy' && link.href !== '/terms',
    );

    return (
        <footer className="bg-background px-4 py-10 text-start sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-[2rem] border border-border bg-surface px-6 py-6 shadow-sm sm:px-10 sm:py-8 lg:px-12">
                    <div id="contact">
                        <FooterNewsletter />
                    </div>

                    <AnimatedAxisDivider axis="x" always className="my-6 sm:my-7" />

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] lg:items-start lg:gap-x-12 lg:gap-y-8">
                        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                            <BrandLogo
                                variant={logoVariant}
                                className="inline-flex items-start leading-none"
                                imageClassName="h-9 w-auto max-w-full object-contain object-left sm:h-10"
                            />
                            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                {t('footer.tagline')}
                            </p>
                            <div className="mt-6 flex items-center gap-5">
                                {socialLinks.map((link) => (
                                    <SocialIconLink key={link.label} link={link} />
                                ))}
                            </div>
                        </div>

                        <FooterLinkGroup title={t('footer.explore')} links={exploreLinks} />
                        <FooterLinkGroup title={t('footer.company')} links={companyLinks} />
                        <FooterLinkGroup title={t('footer.travelHelp')} links={travelHelpLinks} />
                    </div>

                    <div className="mt-8 border-t border-border pt-5 sm:mt-10">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                © {year} {brandName}. {t('footer.allRightsReserved')}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                <Link
                                    href="/privacy"
                                    className={cn(
                                        linkClassName,
                                        'underline decoration-border underline-offset-4',
                                    )}
                                >
                                    {t('nav.privacyPolicy')}
                                </Link>
                                <Link
                                    href="/terms"
                                    className={cn(
                                        linkClassName,
                                        'underline decoration-border underline-offset-4',
                                    )}
                                >
                                    {t('nav.termsConditions')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
