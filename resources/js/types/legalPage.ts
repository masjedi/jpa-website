export interface LegalSectionLink {
    href: string;
    label: string;
}

export interface LegalDocumentSection {
    title: string;
    body: string;
    linkHref: string | null;
    linkLabel: string | null;
}

export interface LegalDocumentContent {
    key: string;
    eyebrow: string;
    title: string;
    intro: string;
    sections: LegalDocumentSection[];
}

export interface AdminLegalPageSummary {
    id: number;
    key: string;
    label: string;
    title: Record<string, string>;
    updated: string;
    sectionCount: number;
}

export interface AdminLegalSection {
    title: string;
    body: string;
    link_href: string;
    link_label: string;
}

export interface AdminLegalPage {
    id: number;
    key: string;
    label: string;
    eyebrow: Record<string, string>;
    title: Record<string, string>;
    intro: Record<string, string>;
    sections: Record<string, AdminLegalSection[]>;
}
