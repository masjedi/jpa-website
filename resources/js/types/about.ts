import type { LucideIcon } from 'lucide-react';

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    location: string;
    image: string;
    bio: string;
    languages: readonly string[];
    isFounder?: boolean;
}

export interface AboutMilestone {
    year: string;
    title: string;
    description: string;
}

export interface AboutValue {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface AboutStat {
    value: string;
    label: string;
}

export interface AboutMissionVision {
    mission: {
        title: string;
        description: string;
    };
    vision: {
        title: string;
        description: string;
    };
}

export interface AboutWhatWeDoItem {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface AboutWhyChooseItem {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
}

export interface AboutPartner {
    name: string;
    category: string;
    description: string;
}
