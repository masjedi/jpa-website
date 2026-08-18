import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ContactLanding } from '@/components/sections/contact/ContactLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Contact() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Contact and Trip Inquiry"
                description="Contact Journey to Peace about travel in Afghanistan. Every inquiry is reviewed personally. Submitting a message does not reserve a seat or confirm a trip."
            />
            <ContactLanding />
        </>
    );
}

Contact.layout = PublicLayout;
