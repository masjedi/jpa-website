import { Link } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';

import {
    companyLinks,
    exploreLinks,
    helpLinks,
    isInertiaPageLink,
    planTripHref,
    type PublicNavLink,
} from '@/components/public/navigation';

const linkClassName =
    'text-sm text-brand-on-surface/80 transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

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
        <div>
            <h2 className="font-heading text-sm font-semibold text-brand-on-surface">{title}</h2>
            <ul className="mt-4 space-y-2">
                {links.map((link) => (
                    <li key={link.label}>
                        <FooterLink link={link} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t-2 border-secondary bg-brand-surface text-start text-brand-on-surface">
            <div className="mx-auto max-w-7xl px-4 py-12 text-start sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <span
                                aria-hidden
                                className="flex size-9 items-center justify-center rounded-full bg-brand-on-surface/10 text-sm font-semibold"
                            >
                                AT
                            </span>
                            <span className="font-heading text-lg font-semibold">
                                Journey to Peace Afghanistan
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-brand-on-surface/80">
                            Guided journeys through Afghanistan with local expertise, cultural
                            respect and carefully planned discovery.
                        </p>
                        <ul className="space-y-2 text-sm text-brand-on-surface/80">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                                <span>Kabul, Afghanistan</span>
                            </li>
                            <li>
                                <a
                                    href="mailto:hello@journeytopace.af"
                                    className="inline-flex items-center gap-2 transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    <Mail className="size-4 shrink-0 text-secondary" aria-hidden />
                                    hello@journeytopace.af
                                </a>
                            </li>
                        </ul>
                        <a
                            href={planTripHref}
                            className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Plan My Trip
                        </a>
                    </div>

                    <FooterLinkGroup title="Explore" links={exploreLinks} />
                    <FooterLinkGroup title="Company" links={companyLinks} />
                    <FooterLinkGroup title="Travel help" links={helpLinks} />
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-brand-on-surface/15 pt-6 text-sm text-brand-on-surface/70 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {year} Afghanistan Tourism. All rights reserved.</p>
                    <p>Inquiries and quotations — not instant reservations.</p>
                </div>
            </div>
        </footer>
    );
}
