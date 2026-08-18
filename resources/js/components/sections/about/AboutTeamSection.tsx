import { MapPin } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { teamMembers } from '@/data/aboutData';
import type { TeamMember } from '@/types/about';

function TeamCard({
    member,
    delay = 0,
    featured = false,
}: {
    member: TeamMember;
    delay?: number;
    featured?: boolean;
}) {
    return (
        <FadeIn delay={delay} className={featured ? 'sm:col-span-2' : undefined}>
            <article
                className={`group relative h-full overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    featured ? 'aspect-[16/10] sm:aspect-[2/1]' : 'aspect-[3/4]'
                }`}
            >
                <img
                    src={member.image}
                    alt={`Portrait of ${member.name}`}
                    className="size-full object-cover grayscale-[35%] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/25 to-transparent" />

                {member.isFounder ? (
                    <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                        Founder
                    </span>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 p-5 text-start">
                    <p className="font-heading text-lg font-semibold text-white drop-shadow sm:text-xl">
                        {member.name}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-white/85">
                        {member.role}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-white/70">
                        <MapPin className="size-3" aria-hidden />
                        {member.location}
                    </p>

                    <div className="overflow-hidden transition-all duration-500 lg:max-h-0 lg:opacity-0 lg:group-hover:mt-3 lg:group-hover:max-h-48 lg:group-hover:opacity-100">
                        <p
                            className={`mt-3 text-xs leading-relaxed text-white/85 lg:mt-0 ${
                                featured ? 'sm:text-sm' : 'line-clamp-4'
                            }`}
                        >
                            {member.bio}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {member.languages.map((language) => (
                                <span
                                    key={language}
                                    className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                                >
                                    {language}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </FadeIn>
    );
}

export function AboutTeamSection() {
    const founder = teamMembers.find((member) => member.isFounder);
    const rest = teamMembers.filter((member) => !member.isFounder);

    return (
        <section id="team" className="bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            The people
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            Meet the team behind the journeys
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Guides, planners and coordinators — every itinerary is
                            reviewed by someone who knows the route first-hand.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {founder ? (
                        <TeamCard member={founder} featured delay={0} />
                    ) : null}
                    {rest.map((member, index) => (
                        <TeamCard
                            key={member.id}
                            member={member}
                            delay={(index + 1) * 0.05}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
