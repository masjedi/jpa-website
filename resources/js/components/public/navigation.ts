export interface PublicNavLink {
    label: string;
    href: string;
}

export const primaryLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tours', href: '/tours' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Services', href: '/services' },
    { label: 'Articles', href: '/articles' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
] as const satisfies readonly PublicNavLink[];

export const exploreLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tours & Packages', href: '/tours' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Gallery', href: '/gallery' },
] as const satisfies readonly PublicNavLink[];

export const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Articles', href: '/articles' },
    { label: 'Contact', href: '/contact' },
] as const satisfies readonly PublicNavLink[];

export const helpLinks = [
    { label: 'Booking process', href: '/#booking' },
    { label: 'Travel Information', href: '/#faq' },
    { label: 'Donation', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
] as const satisfies readonly PublicNavLink[];

export const planTripHref = '/contact';

export const donateHref = '/contact';

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
