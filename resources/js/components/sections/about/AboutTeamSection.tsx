import { Mail, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { teamPageCopy } from '@/data/teamPageCopy';
import { buildWebMailComposeHref } from '@/lib/mailto';
import { cn } from '@/lib/utils';
import type { PublicTeamMember } from '@/types/team';

const ARC_LAYOUT = [
    { rotate: -26, translateY: 28 },
    { rotate: -14, translateY: 10 },
    { rotate: -4, translateY: 0 },
    { rotate: 4, translateY: 0 },
    { rotate: 14, translateY: 10 },
    { rotate: 26, translateY: 28 },
] as const;

function TeamContactLink({
    href,
    label,
    icon: Icon,
    external = false,
    iconClassName,
}: {
    href: string;
    label: string;
    icon: LucideIcon;
    external?: boolean;
    iconClassName: string;
}) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group flex items-start gap-3 rounded-xl py-1 text-sm text-brand-on-surface/75 transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
            <span
                className={cn(
                    'mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/10 text-brand-on-surface/80 shadow-[0_4px_14px_rgba(0,0,0,0.16)] backdrop-blur-sm',
                    'transition-[transform,background-color,border-color,color,box-shadow] duration-300',
                    'motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-105 motion-safe:group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.22)]',
                    iconClassName,
                )}
            >
                <Icon
                    className="size-[1.125rem] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
                    strokeWidth={2.25}
                    aria-hidden
                />
            </span>
            <span className="min-w-0 flex-1 pt-2 leading-snug break-words">{label}</span>
        </a>
    );
}

function TeamContactDetails({ member }: { member: PublicTeamMember }) {
    return (
        <div className="mt-5 space-y-3">
            <TeamContactLink
                href={buildWebMailComposeHref(member.email)}
                label={member.email}
                icon={Mail}
                external
                iconClassName="motion-safe:group-hover:border-sky-300/35 motion-safe:group-hover:bg-sky-400/15 motion-safe:group-hover:text-sky-300"
            />
            <TeamContactLink
                href={member.whatsappHref}
                label={member.whatsapp}
                icon={MessageCircle}
                external
                iconClassName="motion-safe:group-hover:border-secondary/40 motion-safe:group-hover:bg-secondary/18 motion-safe:group-hover:text-secondary"
            />
        </div>
    );
}

function TeamPortrait({
    src,
    alt,
    className,
    frameClassName,
}: {
    src: string;
    alt: string;
    className?: string;
    frameClassName?: string;
}) {
    return (
        <div
            className={cn(
                'relative overflow-hidden bg-surface-muted/80',
                frameClassName ?? 'aspect-[4/5] w-full rounded-2xl',
                className,
            )}
        >
            <img
                src={src}
                alt={alt}
                className="absolute inset-0 size-full object-contain object-center"
                loading="lazy"
            />
        </div>
    );
}

function TeamGridCard({
    member,
    delay = 0,
}: {
    member: PublicTeamMember;
    delay?: number;
}) {
    return (
        <FadeIn delay={delay}>
            <article className="text-start">
                <TeamPortrait
                    src={member.image}
                    alt={`Portrait of ${member.name}`}
                />

                <h3 className="font-heading mt-5 text-lg font-semibold text-brand-on-surface">
                    {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-sky-400">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/65">
                    {member.bio}
                </p>

                <TeamContactDetails member={member} />
            </article>
        </FadeIn>
    );
}

function TeamArcPhoto({
    member,
    rotate,
    translateY,
}: {
    member: PublicTeamMember;
    rotate: number;
    translateY: number;
}) {
    return (
        <div
            className="relative shrink-0"
            style={{
                transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
            }}
        >
            <div className="size-20 overflow-hidden rounded-2xl border border-white/10 bg-surface-muted/80 shadow-lg shadow-black/30 sm:size-24">
                <img
                    src={member.image}
                    alt=""
                    aria-hidden
                    className="size-full object-contain object-center"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export function AboutTeamSection({ members }: { members: PublicTeamMember[] }) {
    const arcMembers = members.slice(0, ARC_LAYOUT.length);

    return (
        <section id="leadership" className="bg-brand-deep text-brand-on-surface">
            <div className="relative overflow-hidden pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pt-36">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(117,166,199,0.22)_0%,rgba(42,163,160,0.12)_32%,transparent_68%)]"
                />

                <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
                    <FadeIn>
                        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                            {teamPageCopy.hero.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-on-surface/70 sm:text-base">
                            {teamPageCopy.hero.description}
                        </p>
                    </FadeIn>
                </div>

                <div
                    className="relative z-10 mx-auto mt-12 flex max-w-4xl items-end justify-center gap-3 px-4 sm:mt-14 sm:gap-4"
                    aria-hidden
                >
                    {arcMembers.map((member, index) => (
                        <TeamArcPhoto
                            key={member.id}
                            member={member}
                            rotate={ARC_LAYOUT[index].rotate}
                            translateY={ARC_LAYOUT[index].translateY}
                        />
                    ))}
                </div>
            </div>

            <div className="border-t border-white/8 pb-16 pt-14 sm:pb-20 sm:pt-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="mx-auto max-w-3xl text-center">
                            <h3 className="font-heading text-2xl font-semibold sm:text-3xl">
                                {teamPageCopy.grid.title}
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-brand-on-surface/70 sm:text-base">
                                {teamPageCopy.grid.description}
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {members.map((member, index) => (
                            <TeamGridCard
                                key={member.id}
                                member={member}
                                delay={index * 0.04}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
