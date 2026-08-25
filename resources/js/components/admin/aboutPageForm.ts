import type { AboutPageContent } from '@/types/aboutPage';

export type AboutContentFormValues = {
    introEyebrow: string;
    introTitle: string;
    introDescription: string;
    missionSectionEyebrow: string;
    missionSectionTitle: string;
    missionTitle: string;
    missionDescription: string;
    visionTitle: string;
    visionDescription: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
};

export function aboutContentToFormValues(content: AboutPageContent): AboutContentFormValues {
    return {
        introEyebrow: content.intro.eyebrow,
        introTitle: content.intro.title,
        introDescription: content.intro.description,
        missionSectionEyebrow: content.missionSection.eyebrow,
        missionSectionTitle: content.missionSection.title,
        missionTitle: content.missionVision.mission.title,
        missionDescription: content.missionVision.mission.description,
        visionTitle: content.missionVision.vision.title,
        visionDescription: content.missionVision.vision.description,
        ctaEyebrow: content.cta.eyebrow,
        ctaTitle: content.cta.title,
        ctaDescription: content.cta.description,
        ctaPrimaryLabel: content.cta.primaryLabel,
        ctaPrimaryHref: content.cta.primaryHref,
        ctaSecondaryLabel: content.cta.secondaryLabel,
        ctaSecondaryHref: content.cta.secondaryHref,
    };
}

export function buildAboutContentPayload(values: AboutContentFormValues): Record<string, string> {
    return {
        intro_eyebrow: values.introEyebrow.trim(),
        intro_title: values.introTitle.trim(),
        intro_description: values.introDescription.trim(),
        mission_section_eyebrow: values.missionSectionEyebrow.trim(),
        mission_section_title: values.missionSectionTitle.trim(),
        mission_title: values.missionTitle.trim(),
        mission_description: values.missionDescription.trim(),
        vision_title: values.visionTitle.trim(),
        vision_description: values.visionDescription.trim(),
        cta_eyebrow: values.ctaEyebrow.trim(),
        cta_title: values.ctaTitle.trim(),
        cta_description: values.ctaDescription.trim(),
        cta_primary_label: values.ctaPrimaryLabel.trim(),
        cta_primary_href: values.ctaPrimaryHref.trim(),
        cta_secondary_label: values.ctaSecondaryLabel.trim(),
        cta_secondary_href: values.ctaSecondaryHref.trim(),
    };
}
