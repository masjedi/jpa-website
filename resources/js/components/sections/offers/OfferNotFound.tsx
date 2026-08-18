import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface OfferNotFoundProps {
    title?: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
}

export function OfferNotFound({
    title = 'Page not found',
    description = 'This tour or package may have moved or is no longer available.',
    backHref = '/tours',
    backLabel = 'Back to tours',
}: OfferNotFoundProps) {
    return (
        <section className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
                {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
            <Link
                href={backHref}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <ArrowLeft className="size-4" aria-hidden />
                {backLabel}
            </Link>
        </section>
    );
}
