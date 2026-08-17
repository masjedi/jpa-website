export interface PublicNavLink {
    label: string;
    href: string;
}

export const primaryLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tours', href: '/tours' },
    { label: 'Destinations', href: '/#destinations' },
    { label: 'Services', href: '/#services' },
    { label: 'Articles', href: '/#articles' },
    { label: 'About', href: '/#about' },
] as const satisfies readonly PublicNavLink[];

export const exploreLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tours & Packages', href: '/tours' },
    { label: 'Destinations', href: '/#destinations' },
    { label: 'Gallery', href: '/#gallery' },
] as const satisfies readonly PublicNavLink[];

export const companyLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Articles', href: '/#articles' },
    { label: 'Contact', href: '#contact' },
] as const satisfies readonly PublicNavLink[];

export const helpLinks = [
    { label: 'Booking process', href: '/#booking' },
    { label: 'Travel Information', href: '/#travel-info' },
    { label: 'Donation', href: '/#donation' },
    { label: 'Privacy Policy', href: '/#privacy' },
    { label: 'Terms & Conditions', href: '/#terms' },
] as const satisfies readonly PublicNavLink[];

export const planTripHref = '#contact';

export function isInertiaPageLink(href: string): boolean {
    return href.startsWith('/') && !href.includes('#');
}
