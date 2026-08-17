import { CheckCircle2, Send, X } from 'lucide-react';
import { useEffect, useId, useState, type FormEvent } from 'react';

import type { InquiryFormData } from '@/types/tours';

interface TourInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: InquiryFormData;
}

export function TourInquiryModal({
    isOpen,
    onClose,
    initialData,
}: TourInquiryModalProps) {
    const titleId = useId();
    const [formData, setFormData] = useState<InquiryFormData>({
        tourTitle: '',
        preferredDate: '',
        travelerCount: '2 travelers',
        durationPreference: '',
        fullName: '',
        email: '',
        nationality: '',
        whatsappOrPhone: '',
        notes: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                ...initialData,
                tourTitle: initialData.tourTitle ?? prev.tourTitle,
                preferredDate: initialData.preferredDate ?? prev.preferredDate,
            }));
        }
    }, [initialData]);

    useEffect(() => {
        if (!isOpen) {
            setSubmitted(false);
            setIsSubmitting(false);
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Simulate prompt inquiry submission for UX phase
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 600);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
        >
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-surface-muted/50 px-6 py-5 sm:px-8">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Tour Inquiry & Consultation
                        </span>
                        <h2
                            id={titleId}
                            className="font-heading mt-1 text-xl font-bold text-foreground sm:text-2xl"
                        >
                            {submitted ? 'Inquiry Received' : 'Plan Your Afghan Journey'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        aria-label="Close dialog"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
                    {submitted ? (
                        <div className="py-8 text-center">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                <CheckCircle2 className="size-9" />
                            </div>
                            <h3 className="font-heading mt-5 text-2xl font-bold text-foreground">
                                Tashakor! Thank you, {formData.fullName || 'traveler'}.
                            </h3>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                                We have received your inquiry for{' '}
                                <strong className="font-semibold text-foreground">
                                    {formData.tourTitle || 'your custom journey'}
                                </strong>
                                . Our Kabul operations team will review ground logistics, visa requirements and availability, and email you a detailed tailored proposal within 24 hours.
                            </p>
                            <div className="mt-6 rounded-2xl border border-border bg-surface-muted p-4 text-start text-xs text-muted-foreground">
                                <p className="font-medium text-foreground">What happens next?</p>
                                <ul className="mt-2 list-disc space-y-1 pl-4">
                                    <li>Direct consultation via email or WhatsApp</li>
                                    <li>Customization of itinerary, dates and accommodation preferences</li>
                                    <li>Official Letter of Invitation (LOI) preparation for your visa</li>
                                </ul>
                            </div>
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Return to Tours
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 text-start">
                            <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-xs leading-relaxed text-foreground">
                                <span className="font-semibold text-secondary">Inquiry Notice:</span> Submitting this form initiates a custom consultation with our local Afghan team. No instant charges or automatic reservations are made.
                            </div>

                            {/* Tour selection */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Selected Tour / Package
                                </label>
                                <input
                                    type="text"
                                    value={formData.tourTitle}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tourTitle: e.target.value })
                                    }
                                    placeholder="e.g. Bamiyan Valley & Band-e Amir Circuit or Custom Trip"
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Estimated Travel Date
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.preferredDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, preferredDate: e.target.value })
                                        }
                                        placeholder="e.g. May 2026 or Spring 2026"
                                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Group Size
                                    </label>
                                    <select
                                        value={formData.travelerCount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, travelerCount: e.target.value })
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    >
                                        <option value="1 traveler (Solo)">1 traveler (Solo)</option>
                                        <option value="2 travelers (Couple / Friends)">2 travelers (Couple / Friends)</option>
                                        <option value="3-4 travelers (Small Group)">3-4 travelers (Small Group)</option>
                                        <option value="5-8 travelers (Private Group)">5-8 travelers (Private Group)</option>
                                        <option value="9+ travelers (Expedition / Delegation)">9+ travelers (Expedition / Delegation)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Your Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                        placeholder="e.g. Jane Doe"
                                        required
                                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        placeholder="e.g. jane@example.com"
                                        required
                                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Passport / Nationality
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nationality}
                                        onChange={(e) =>
                                            setFormData({ ...formData, nationality: e.target.value })
                                        }
                                        placeholder="For visa advice (e.g. British, German, Australian)"
                                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        WhatsApp or Phone (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.whatsappOrPhone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, whatsappOrPhone: e.target.value })
                                        }
                                        placeholder="+1 234 567 8900"
                                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Special Interests, Questions or Custom Requests
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    placeholder="Tell us about your travel pace, specific places you want to see, dietary needs, or photography interests..."
                                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                                >
                                    <Send className="size-4" />
                                    {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
