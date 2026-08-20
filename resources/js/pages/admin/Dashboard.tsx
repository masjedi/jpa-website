import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, Compass, LayoutDashboard, Map, MessageSquareText } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import '@/types/inertia';

const quickLinks = [
    {
        label: 'Tours',
        href: '/admin/tours',
        description: 'Manage itineraries, departures, and pricing notes.',
        icon: Map,
    },
    {
        label: 'Destinations',
        href: '/admin/destinations',
        description: 'Update regions, highlights, and travel guidance.',
        icon: Compass,
    },
    {
        label: 'Articles',
        href: '/admin/articles',
        description: 'Publish stories, guides, and travel updates.',
        icon: BookOpen,
    },
    {
        label: 'Inquiries',
        href: '/admin/inquiries',
        description: 'Review booking requests and traveler messages.',
        icon: MessageSquareText,
        badge: '3 new',
    },
] as const;

export default function Dashboard() {
    const { auth } = usePage().props;
    const firstName = auth.user?.name.split(' ')[0] ?? 'Admin';

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <AdminSectionHeader
                    eyebrow="Overview"
                    title={`Welcome back, ${firstName}`}
                    description="Your Journey to Peace workspace is ready. Use the sidebar or quick links below to open each content area."
                    icon={LayoutDashboard}
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {quickLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-secondary/30 hover:bg-surface-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-4" aria-hidden />
                                    </span>
                                    {item.badge ? (
                                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </div>
                                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                                    {item.label}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary">
                                    Open section
                                    <ArrowRight
                                        className="size-4 transition-transform group-hover:translate-x-0.5"
                                        aria-hidden
                                    />
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <AdminSectionPanel
                    title="Today at a glance"
                    description="Summary cards will appear here once modules are connected to live data."
                >
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            { label: 'Active tours', value: '12' },
                            { label: 'Published destinations', value: '8' },
                            { label: 'Open inquiries', value: '3' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl border border-border bg-surface-muted/50 px-4 py-5 text-center"
                            >
                                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </AdminSectionPanel>
            </div>
        </>
    );
}

Dashboard.layout = withAdminLayout('Dashboard');
