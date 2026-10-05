import type { TranslatedString } from '@/types/locale';

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

export interface AdminAboutIntroContent {
    eyebrow: TranslatedString;
    title: TranslatedString;
    description: TranslatedString;
}

export interface AdminAboutMissionSectionContent {
    eyebrow: TranslatedString;
    title: TranslatedString;
}

export interface AdminAboutMissionVisionBlock {
    title: TranslatedString;
    description: TranslatedString;
}

export interface AdminAboutMissionVisionContent {
    mission: AdminAboutMissionVisionBlock;
    vision: AdminAboutMissionVisionBlock;
}

export interface AdminAboutCtaContent {
    eyebrow: TranslatedString;
    title: TranslatedString;
    description: TranslatedString;
    primaryLabel: TranslatedString;
    primaryHref: string;
    secondaryLabel: TranslatedString;
    secondaryHref: string;
}

export interface AdminAboutPageContent {
    intro: AdminAboutIntroContent;
    missionSection: AdminAboutMissionSectionContent;
    missionVision: AdminAboutMissionVisionContent;
    cta: AdminAboutCtaContent;
}

export type AboutJourneyStepStatus = 'Published' | 'Draft';

export interface AboutJourneyStep {
    id: number;
    title: TranslatedString;
    description: TranslatedString;
    image: string;
    imageAlt: TranslatedString;
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
