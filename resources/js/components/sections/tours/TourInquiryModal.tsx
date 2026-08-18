import { CheckCircle2, Send, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import type { InquiryFormData } from '@/types/tours';

const labelClass = 'block text-sm font-medium text-foreground';
const fieldClass =
    'mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus';

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
    const tourFieldId = useId();
    const dateFieldId = useId();
    const groupFieldId = useId();
    const nameFieldId = useId();
    const emailFieldId = useId();
    const nationalityFieldId = useId();
    const phoneFieldId = useId();
    const notesFieldId = useId();
    const firstFieldRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<InquiryFormData>({
        tourTitle: '',
        preferredDate: '',
        travelerCount: '2',
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
        window.setTimeout(() => firstFieldRef.current?.focus(), 0);

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

        if (isSubmitting || submitted) {
            return;
        }

        setIsSubmitting(true);

        window.setTimeout(() => {
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
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
                    <h2
                        id={titleId}
                        className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
                    >
                        {submitted ? 'Inquiry received' : 'Request this tour'}
                    </h2>
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
                        <div className="py-8 text-center" role="status">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                <CheckCircle2 className="size-9" />
                            </div>
                            <h3 className="font-heading mt-5 text-2xl font-semibold text-foreground">
                                Thank you{formData.fullName ? `, ${formData.fullName}` : ''}
                            </h3>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                                We received your inquiry
                                {formData.tourTitle ? (
                                    <>
                                        {' '}
                                        for{' '}
                                        <strong className="font-semibold text-foreground">
                                            {formData.tourTitle}
                                        </strong>
                                    </>
                                ) : null}
                                . Our team will reply with a tailored proposal.
                            </p>
                            <p className="mt-4 text-xs text-muted-foreground">
                                No seat is reserved until details are agreed in writing.
                            </p>
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
                        <form onSubmit={handleSubmit} className="space-y-4 text-start">
                            <div>
                                <label htmlFor={tourFieldId} className={labelClass}>
                                    Tour
                                </label>
                                <input
                                    id={tourFieldId}
                                    ref={firstFieldRef}
                                    type="text"
                                    value={formData.tourTitle}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tourTitle: e.target.value })
                                    }
                                    required
                                    className={fieldClass}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor={dateFieldId} className={labelClass}>
                                        Travel dates
                                    </label>
                                    <input
                                        id={dateFieldId}
                                        type="text"
                                        value={formData.preferredDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, preferredDate: e.target.value })
                                        }
                                        className={fieldClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={groupFieldId} className={labelClass}>
                                        Group size
                                    </label>
                                    <select
                                        id={groupFieldId}
                                        value={formData.travelerCount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, travelerCount: e.target.value })
                                        }
                                        className={fieldClass}
                                    >
                                        <option value="1">1 traveler</option>
                                        <option value="2">2 travelers</option>
                                        <option value="3-4">3–4 travelers</option>
                                        <option value="5-8">5–8 travelers</option>
                                        <option value="9+">9+ travelers</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor={nameFieldId} className={labelClass}>
                                        Full name
                                    </label>
                                    <input
                                        id={nameFieldId}
                                        type="text"
                                        autoComplete="name"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                        required
                                        className={fieldClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={emailFieldId} className={labelClass}>
                                        Email
                                    </label>
                                    <input
                                        id={emailFieldId}
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        required
                                        className={fieldClass}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor={nationalityFieldId} className={labelClass}>
                                        Nationality
                                    </label>
                                    <input
                                        id={nationalityFieldId}
                                        type="text"
                                        autoComplete="country-name"
                                        value={formData.nationality}
                                        onChange={(e) =>
                                            setFormData({ ...formData, nationality: e.target.value })
                                        }
                                        className={fieldClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={phoneFieldId} className={labelClass}>
                                        WhatsApp or phone
                                    </label>
                                    <input
                                        id={phoneFieldId}
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.whatsappOrPhone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, whatsappOrPhone: e.target.value })
                                        }
                                        className={fieldClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor={notesFieldId} className={labelClass}>
                                    Notes
                                </label>
                                <textarea
                                    id={notesFieldId}
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    className={`${fieldClass} resize-y`}
                                />
                            </div>

                            <p className="text-xs leading-relaxed text-muted-foreground">
                                This sends an inquiry. It does not reserve a seat or confirm a trip.
                            </p>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
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
                                    <Send className="size-4" aria-hidden />
                                    {isSubmitting ? 'Sending…' : 'Send inquiry'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
