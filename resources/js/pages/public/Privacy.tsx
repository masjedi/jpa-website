import { PageMeta } from '@/components/public/PageMeta';
import { LegalDocument } from '@/components/sections/legal/LegalDocument';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { LegalDocumentContent } from '@/types/legalPage';

interface PrivacyPageProps {
    document: LegalDocumentContent;
}

export default function Privacy({ document }: PrivacyPageProps) {
    return (
        <>
            <PageMeta />
            <LegalDocument document={document} />
        </>
    );
}

Privacy.layout = PublicLayout;
