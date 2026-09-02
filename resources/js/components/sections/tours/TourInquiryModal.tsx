import { useForm } from '@inertiajs/react';
import { CheckCircle2, Send, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import type { InquiryFormData } from '@/types/tours';
import { useTranslations } from '@/hooks/use-translations';

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
    const [submitted, setSubmitted] = useState(false);
    const [submittedName, setSubmittedName] = useState('');
    const [submittedTour, setSubmittedTour] = useState('');
    const { t } = useTranslations();

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        tourTitle: '',
        preferredDate: '',
        travelerCount: '2',
        fullName: '',
        email: '',
        nationality: '',
        whatsappOrPhone: '',
        notes: '',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            tourTitle: initialData?.tourTitle ?? '',
            preferredDate: initialData?.preferredDate ?? '',
            travelerCount: initialData?.travelerCount ?? '2',
            fullName: initialData?.fullName ?? '',
            email: initialData?.email ?? '',
            nationality: initialData?.nationality ?? '',
            whatsappOrPhone: initialData?.whatsappOrPhone ?? '',
            notes: initialData?.notes ?? '',
        });
    }, [isOpen, initialData?.tourTitle, initialData?.preferredDate]);

    useEffect(() => {
        if (!isOpen) {
            setSubmitted(false);
            setSubmittedName('');
            setSubmittedTour('');
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

        if (processing || submitted) {
            return;
        }

        clearErrors();

        post('/inquiries/tour', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmittedName(data.fullName);
                setSubmittedTour(data.tourTitle);
                setSubmitted(true);
                reset();
            },
        });
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
                <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
                    <h2
                        id={titleId}
                        className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
                    >
                        {submitted ? t('tours.inquiryReceived') : t('tours.requestThisTour')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        aria-label={t('buttons.close')}
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
                                Thank you{submittedName ? `, ${submittedName}` : ''}
                            </h3>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                                We received your inquiry
                                {submittedTour ? (
                                    <>
                                        {' '}
                                        for{' '}
                                        <strong className="font-semibold text-foreground">
                                            {submittedTour}
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
                        <form onSubmit={handleSubmit} className="space-y-4 text-start" noValidate>
                            <div>
                                <label htmlFor={tourFieldId} className={labelClass}>
                                    Tour
                                </label>
                                <input
                                    id={tourFieldId}
                                    ref={firstFieldRef}
                                    type="text"
                                    value={data.tourTitle}
                                    onChange={(e) => setData('tourTitle', e.target.value)}
                                    required
                                    minLength={2}
                                    maxLength={200}
                                    className={fieldClass}
                                />
                                {errors.tourTitle ? (
                                    <p className="mt-1 text-xs text-destructive" role="alert">
                                        {errors.tourTitle}
                                    </p>
                                ) : null}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor={dateFieldId} className={labelClass}>
                                        Travel dates
                                    </label>
                                    <input
                                        id={dateFieldId}
                                        type="text"
                                        value={data.preferredDate}
                                        onChange={(e) => setData('preferredDate', e.target.value)}
                                        maxLength={120}
                                        className={fieldClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={groupFieldId} className={labelClass}>
                                        Group size
                                    </label>
                                    <select
                                        id={groupFieldId}
                                        value={data.travelerCount}
                                        onChange={(e) => setData('travelerCount', e.target.value)}
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
                                        value={data.fullName}
                                        onChange={(e) => setData('fullName', e.target.value)}
                                        required
                                        minLength={2}
                                        maxLength={120}
                                        className={fieldClass}
                                    />
                                    {errors.fullName ? (
                                        <p className="mt-1 text-xs text-destructive" role="alert">
                                            {errors.fullName}
                                        </p>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor={emailFieldId} className={labelClass}>
                                        Email
                                    </label>
                                    <input
                                        id={emailFieldId}
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        minLength={5}
                                        maxLength={255}
                                        className={fieldClass}
                                    />
                                    {errors.email ? (
                                        <p className="mt-1 text-xs text-destructive" role="alert">
                                            {errors.email}
                                        </p>
                                    ) : null}
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
                                        value={data.nationality}
                                        onChange={(e) => setData('nationality', e.target.value)}
                                        maxLength={120}
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
                                        value={data.whatsappOrPhone}
                                        onChange={(e) => setData('whatsappOrPhone', e.target.value)}
                                        minLength={7}
                                        maxLength={60}
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
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    maxLength={5000}
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
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
                                >
                                    <Send className="size-4" aria-hidden />
                                    {processing ? t('buttons.sending') : t('buttons.sendInquiryShort')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
