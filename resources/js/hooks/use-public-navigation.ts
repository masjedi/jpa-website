import { useMemo } from 'react';

import {
    companyLinks as companyLinkDefs,
    exploreLinks as exploreLinkDefs,
    helpLinks as helpLinkDefs,
    primaryLinks as primaryLinkDefs,
    type PrimaryNavItem,
    type PublicNavLink,
} from '@/components/public/navigation';
import { useTranslations } from '@/hooks/use-translations';

function translateNavLink(
    link: PublicNavLink,
    labelKey: string,
    t: (key: string) => string,
): PublicNavLink {
    return {
        ...link,
        label: t(labelKey),
    };
}

export function usePublicNavigation() {
    const { t } = useTranslations();

    return useMemo(() => {
        const primaryLinks: PrimaryNavItem[] = primaryLinkDefs.map((item) => {
            if ('children' in item && item.href === '/tours') {
                return {
                    ...item,
                    label: t('nav.tours'),
                    children: [
                        translateNavLink(item.children[0], 'nav.allTours', t),
                        translateNavLink(item.children[1], 'nav.tourPackages', t),
                        translateNavLink(item.children[2], 'nav.destinations', t),
                    ],
                };
            }

            if ('children' in item) {
                return {
                    ...item,
                    label: t('nav.about'),
                    children: [
                        translateNavLink(item.children[0], 'nav.about', t),
                        translateNavLink(item.children[1], 'nav.ourTeam', t),
                    ],
                };
            }

            const keyByHref: Record<string, string> = {
                '/': 'nav.home',
                '/services': 'nav.services',
                '/articles': 'nav.articles',
                '/gallery': 'nav.gallery',
                '/contact': 'nav.contact',
            };

            return translateNavLink(item, keyByHref[item.href] ?? 'nav.home', t);
        });

        const exploreLinks = exploreLinkDefs.map((link) => {
            const keyByHref: Record<string, string> = {
                '/': 'nav.home',
                '/tours': 'nav.toursAndPackages',
                '/tours?view=destinations': 'nav.destinations',
                '/gallery': 'nav.gallery',
            };

            return translateNavLink(link, keyByHref[link.href] ?? 'nav.home', t);
        });

        const companyLinks = companyLinkDefs.map((link) => {
            const keyByHref: Record<string, string> = {
                '/about': 'nav.about',
                '/about/team': 'nav.ourTeam',
                '/services': 'nav.services',
                '/articles': 'nav.articles',
                '/contact': 'nav.contact',
            };

            return translateNavLink(link, keyByHref[link.href] ?? 'nav.about', t);
        });

        const helpLinks = helpLinkDefs.map((link) => {
            const keyByHref: Record<string, string> = {
                '/#faq': 'nav.travelInformation',
                '/contact': 'nav.donation',
                '/privacy': 'nav.privacyPolicy',
                '/terms': 'nav.termsConditions',
            };

            return translateNavLink(link, keyByHref[link.href] ?? 'nav.bookingProcess', t);
        });

        return {
            primaryLinks,
            exploreLinks,
            companyLinks,
            helpLinks,
        };
    }, [t]);
}
