import { PageMeta } from '@/components/public/PageMeta';
import { LegalDocument } from '@/components/sections/legal/LegalDocument';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { LegalDocumentContent } from '@/types/legalPage';

interface TermsPageProps {
    document: LegalDocumentContent;
}

export default function Terms({ document }: TermsPageProps) {
    return (
        <>
            <PageMeta />
            <LegalDocument document={document} />
        </>
    );
}

Terms.layout = PublicLayout;
