import { Mail, MessageCircle } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { useTranslations } from '@/hooks/use-translations';
import { buildWebMailComposeHref } from '@/lib/mailto';
import { cn } from '@/lib/utils';
import type { PublicTeamMember } from '@/types/team';

const BAND_TEXTURE =
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=60';

function TeamMemberCard({
    member,
    delay = 0,
}: {
    member: PublicTeamMember;
    delay?: number;
}) {
    const { t } = useTranslations();

    return (
        <FadeIn delay={delay} className="h-full">
            <article className="flex h-full flex-col items-center text-center">
                <div
                    className={cn(
                        'relative size-28 shrink-0 overflow-hidden rounded-full border-[5px] border-surface bg-surface-muted shadow-[0_10px_28px_rgba(7,23,34,0.14)] sm:size-32',
                        'motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1',
                    )}
                >
                    <img
                        src={member.image}
                        alt={t('teamPage.portraitAlt', { name: member.name })}
                        className="absolute inset-0 size-full object-cover object-center"
                        loading="lazy"
                    />
                </div>

                <h3 className="font-heading mt-5 text-sm font-bold uppercase tracking-[0.14em] text-foreground sm:text-[0.9375rem]">
                    {member.name}
                </h3>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {member.role}
                </p>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                </p>

                <div className="mt-5 flex items-center justify-center gap-2">
                    <a
                        href={buildWebMailComposeHref(member.email)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('teamPage.emailAria', { name: member.name })}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <Mail className="size-3.5" strokeWidth={2.25} aria-hidden />
                    </a>
                    <a
                        href={member.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('teamPage.whatsappAria', { name: member.name })}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <MessageCircle className="size-3.5" strokeWidth={2.25} aria-hidden />
                    </a>
                </div>
            </article>
        </FadeIn>
    );
}

export function AboutTeamSection({ members }: { members: PublicTeamMember[] }) {
    const { t } = useTranslations();

    return (
        <section id="leadership" className="bg-surface">
            <div className="relative overflow-hidden bg-brand-deep pt-28 sm:pt-32 lg:pt-36">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.22]"
                    style={{ backgroundImage: `url(${BAND_TEXTURE})` }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-brand-deep/55"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-deep to-transparent"
                />

                <div className="relative z-10 mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6 sm:pb-28">
                    <FadeIn>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                            {t('teamPage.hero.eyebrow')}
                        </p>
                        <h2 className="font-heading mt-3 text-3xl font-bold uppercase tracking-[0.08em] text-brand-on-surface sm:text-4xl lg:text-[2.75rem]">
                            {t('teamPage.hero.title')}
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-on-surface/70 sm:text-base">
                            {t('teamPage.hero.description')}
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 pb-16 sm:-mt-[4.5rem] sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                {members.length === 0 ? (
                    <p className="rounded-2xl border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
                        {t('teamPage.emptyState')}
                    </p>
                ) : (
                    <div
                        className={cn(
                            'grid justify-items-center gap-x-6 gap-y-12',
                            members.length === 1 && 'grid-cols-1',
                            members.length === 2 && 'grid-cols-1 sm:grid-cols-2',
                            members.length === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                            members.length === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
                            members.length >= 5 &&
                                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
                        )}
                    >
                        {members.map((member, index) => (
                            <TeamMemberCard
                                key={member.id}
                                member={member}
                                delay={index * 0.05}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
