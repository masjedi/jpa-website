import { Link } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { LegalDocument, LegalSection } from '@/components/sections/legal/LegalDocument';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Privacy() {
    return (
        <>
            <PageMeta />
            <LegalDocument
                title="Privacy Policy"
                eyebrow="Your information"
                intro="This notice explains what we collect when you browse the site or send an inquiry. It is written for the current public website and will be updated as booking systems go live."
            >
                <LegalSection title="Who we are">
                    <p>
                        Journey to Peace Afghanistan Tours (JPA) is a guided-travel
                        team based in Kabul. Inquiries are reviewed by people on
                        our team — not by an automated booking engine.
                    </p>
                </LegalSection>
                <LegalSection title="What we collect">
                    <p>
                        If you send a contact or trip inquiry, we ask for details
                        such as your name, email address, nationality, travel
                        dates and trip notes. Newsletter fields collect an email
                        address only. We do not collect payment card data on this
                        website.
                    </p>
                </LegalSection>
                <LegalSection title="How we use it">
                    <p>
                        We use inquiry details to reply with information, a
                        quotation or travel advice. We do not sell personal data.
                        We do not use it to confirm seats or process payments
                        from this site.
                    </p>
                </LegalSection>
                <LegalSection title="Cookies and appearance">
                    <p>
                        The site stores your theme preference in the browser so
                        the layout does not flash on return visits. We do not
                        currently run advertising or analytics cookies.
                    </p>
                </LegalSection>
                <LegalSection title="Contact">
                    <p>
                        Questions about this notice can be sent through the{' '}
                        <Link
                            href="/contact"
                            className="font-medium text-secondary underline-offset-4 hover:underline"
                        >
                            contact page
                        </Link>
                        .
                    </p>
                </LegalSection>
            </LegalDocument>
        </>
    );
}

Privacy.layout = PublicLayout;
