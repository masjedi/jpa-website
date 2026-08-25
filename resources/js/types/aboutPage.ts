export interface AboutIntroContent {
    eyebrow: string;
    title: string;
    description: string;
}

export interface AboutMissionSectionContent {
    eyebrow: string;
    title: string;
}

export interface AboutMissionVisionBlock {
    title: string;
    description: string;
}

export interface AboutMissionVisionContent {
    mission: AboutMissionVisionBlock;
    vision: AboutMissionVisionBlock;
}

export interface AboutCtaContent {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
}

export interface AboutPageContent {
    intro: AboutIntroContent;
    missionSection: AboutMissionSectionContent;
    missionVision: AboutMissionVisionContent;
    cta: AboutCtaContent;
}

export type AboutJourneyStepStatus = 'Published' | 'Draft';

export interface AboutJourneyStep {
    id: number;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    iconKey: string;
    order: number;
    status: AboutJourneyStepStatus;
    updated: string;
}

export interface PublicAboutJourneyStep {
    id: number;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    iconKey: string;
}

export interface AboutIconOption {
    value: string;
    label: string;
}

export interface AboutJourneyImageSpec {
    width: number;
    height: number;
    aspect_ratio: string | null;
    max_upload_kilobytes: number;
    hint: string;
}
