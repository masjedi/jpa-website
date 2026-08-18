import { ContactPageBackground } from '@/components/sections/contact/ContactPageBackground';
import { ContactStudio } from '@/components/sections/contact/ContactStudio';

export function ContactLanding() {
    return (
        <div className="relative w-full">
            <div className="pointer-events-none absolute inset-0">
                <ContactPageBackground />
            </div>
            <ContactStudio />
        </div>
    );
}
