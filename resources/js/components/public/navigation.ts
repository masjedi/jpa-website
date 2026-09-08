export interface PublicNavLink {
    label: string;
    href: string;
}

export interface PublicNavDropdown {
    label: string;
    href: string;
    children: readonly PublicNavLink[];
}

export type PrimaryNavItem = PublicNavLink | PublicNavDropdown;

export function isNavDropdown(item: PrimaryNavItem): item is PublicNavDropdown {
    return 'children' in item;
}

export const primaryLinks = [
    { label: 'Home', href: '/' },
    {
        label: 'Tours',
        href: '/tours',
        children: [
            { label: 'All Tours', href: '/tours' },
            { label: 'Tour Packages', href: '/tours?view=packages' },
            { label: 'Destinations', href: '/tours?view=destinations' },
        ],
    },
    { label: 'Services', href: '/services' },
    { label: 'Articles', href: '/articles' },
    { label: 'Gallery', href: '/gallery' },
    {
        label: 'About',
        href: '/about',
        children: [
            { label: 'About', href: '/about' },
            { label: 'Our Team', href: '/about/team' },
        ],
    },
    { label: 'Contact', href: '/contact' },
] as const satisfies readonly PrimaryNavItem[];

export const exploreLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tours & Packages', href: '/tours' },
    { label: 'Destinations', href: '/tours?view=destinations' },
    { label: 'Gallery', href: '/gallery' },
] as const satisfies readonly PublicNavLink[];

export const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Our Team', href: '/about/team' },
    { label: 'Services', href: '/services' },
    { label: 'Articles', href: '/articles' },
    { label: 'Contact', href: '/contact' },
] as const satisfies readonly PublicNavLink[];

export const helpLinks = [
    { label: 'Booking process', href: '/#booking' },
    { label: 'Custom tour request', href: '/booking' },
    { label: 'Travel Information', href: '/#faq' },
    { label: 'Donation', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
] as const satisfies readonly PublicNavLink[];

export const planTripHref = '/contact';

export const customBookingHref = '/booking';

export const tourPackagesHref = '/tours?view=packages';

export const donateHref = '/contact';

export const servicesHref = '/services';

export function packageShowHref(slug: string): string {
    return `/packages/${slug}`;
}

export function tourShowHref(slug: string): string {
    return `/tours/${slug}`;
}

export function destinationShowHref(slug: string): string {
    return `/destinations/${slug}`;
}

export function articleShowHref(slug: string): string {
    return `/articles/${slug}`;
}

export function isInertiaPageLink(href: string): boolean {
    return href.startsWith('/') && !href.includes('#');
}
