export function InquiryCtaBand() {
    return (
        <section
            id="contact"
            className="border-t border-border bg-background py-16 sm:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                    Ready to plan your journey?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    Send a booking inquiry and our team will review your request
                    and respond with a tailored quotation. Submitting an inquiry
                    does not reserve a seat or confirm a trip.
                </p>
                <a
                    href="#contact"
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    Plan My Trip
                </a>
            </div>
        </section>
    );
}
