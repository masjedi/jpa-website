import { Mail, Phone } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { aboutTeam, teamMembers } from '@/data/aboutData';
import type { TeamMember } from '@/types/about';

const ARC_LAYOUT = [
    { rotate: -26, translateY: 28 },
    { rotate: -14, translateY: 10 },
    { rotate: -4, translateY: 0 },
    { rotate: 4, translateY: 0 },
    { rotate: 14, translateY: 10 },
    { rotate: 26, translateY: 28 },
] as const;

function TeamContactDetails({ member }: { member: TeamMember }) {
    return (
        <div className="mt-4 space-y-2">
            <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-sm text-brand-on-surface/65 transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <Mail className="size-4 shrink-0 text-brand-on-surface/45" aria-hidden />
                <span className="break-all">{member.email}</span>
            </a>
            <a
                href={member.whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 text-sm text-brand-on-surface/65 transition-colors hover:text-brand-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <Phone className="size-4 shrink-0 text-brand-on-surface/45" aria-hidden />
                <span>{member.whatsapp}</span>
            </a>
        </div>
    );
}

function TeamGridCard({
    member,
    delay = 0,
}: {
    member: TeamMember;
    delay?: number;
}) {
    return (
        <FadeIn delay={delay}>
            <article className="text-start">
                <div className="overflow-hidden rounded-2xl bg-surface-muted">
                    <img
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                    />
                </div>

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
    member: TeamMember;
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
            <div className="size-20 overflow-hidden rounded-2xl border border-white/10 bg-surface-muted shadow-lg shadow-black/30 sm:size-24">
                <img
                    src={member.image}
                    alt=""
                    aria-hidden
                    className="size-full object-cover"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export function AboutTeamSection() {
    const arcMembers = teamMembers.slice(0, ARC_LAYOUT.length);

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
                            {aboutTeam.hero.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-on-surface/70 sm:text-base">
                            {aboutTeam.hero.description}
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
                                {aboutTeam.grid.title}
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-brand-on-surface/70 sm:text-base">
                                {aboutTeam.grid.description}
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map((member, index) => (
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
