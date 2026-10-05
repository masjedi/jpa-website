import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ContactLanding } from '@/components/sections/contact/ContactLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Contact() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta />
            <ContactLanding />
        </>
    );
}

Contact.layout = PublicLayout;
