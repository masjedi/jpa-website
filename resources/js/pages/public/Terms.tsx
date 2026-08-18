import { Link } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { LegalDocument, LegalSection } from '@/components/sections/legal/LegalDocument';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Terms() {
    return (
        <>
            <PageMeta
                title="Terms and Conditions"
                description="Terms for using the Journey to Peace Afghanistan Tours website and submitting a trip inquiry. Inquiries are not confirmed reservations."
            />
            <LegalDocument
                title="Terms and Conditions"
                eyebrow="Using this website"
                intro="These terms apply to the public website and to trip inquiries sent through it. They do not create a confirmed booking or a guaranteed itinerary."
            >
                <LegalSection title="Inquiries are not reservations">
                    <p>
                        Submitting a form, choosing a tour or requesting a
                        quotation does not reserve a seat, lock a departure or
                        confirm a trip. Our team reviews each request and replies
                        with next steps. A journey is only confirmed after we
                        agree details with you in writing.
                    </p>
                </LegalSection>
                <LegalSection title="Travel information">
                    <p>
                        Guides, itineraries and destination notes on this site
                        are general information. Conditions in Afghanistan can
                        change. We do not make safety guarantees. You remain
                        responsible for visas, insurance and independent travel
                        advice from your government.
                    </p>
                </LegalSection>
                <LegalSection title="Content">
                    <p>
                        Photographs and stories illustrate the kind of journeys
                        we plan. Some public pages still use placeholder imagery
                        while the visual library is completed. Do not treat mock
                        or sample details as a live inventory of departures.
                    </p>
                </LegalSection>
                <LegalSection title="Contact">
                    <p>
                        If anything in these terms is unclear, write to us via
                        the{' '}
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

Terms.layout = PublicLayout;
