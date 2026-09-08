import { useForm, usePage } from '@inertiajs/react';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type FormEvent } from 'react';

import { BookingStepper } from '@/components/sections/booking/BookingStepper';
import { BookingTranslationProvider } from '@/components/sections/booking/BookingTranslationContext';
import { BookingSuccess } from '@/components/sections/booking/BookingSuccess';
import { RequirementsStep } from '@/components/sections/booking/RequirementsStep';
import { ReviewStep } from '@/components/sections/booking/ReviewStep';
import { ServicesStep } from '@/components/sections/booking/ServicesStep';
import { TravelDocumentsStep } from '@/components/sections/booking/TravelDocumentsStep';
import { TravelersStep } from '@/components/sections/booking/TravelersStep';
import { TripPreferencesStep } from '@/components/sections/booking/TripPreferencesStep';
import { BookingStepErrorBanner } from '@/components/sections/booking/bookingFields';
import { createInitialBookingState } from '@/components/sections/booking/bookingModel';
import { buildBookingPayload, mapServerBookingErrors } from '@/components/sections/booking/bookingSubmit';
import {
    firstErrorField,
    hasRequiredAgreements,
    stepForErrorField,
    validateAllBookingSteps,
    validateBookingStep,
} from '@/components/sections/booking/bookingValidation';
import {
    type BookingErrors,
    type CustomBookingState,
} from '@/types/customBooking';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface CustomBookingFormProps {
    destinations: readonly string[];
    seasons: readonly string[];
}

function focusField(fieldId: string): void {
    const field = document.querySelector<HTMLElement>(`[data-field="${fieldId}"]`);
    const target =
        field?.querySelector<HTMLElement>('input, select, textarea, button[aria-pressed]') ?? field;

    target?.scrollIntoView({ block: 'center' });
    target?.focus();
}

export function CustomBookingForm({ destinations, seasons }: CustomBookingFormProps) {
    return (
        <BookingTranslationProvider>
            <CustomBookingFormInner destinations={destinations} seasons={seasons} />
        </BookingTranslationProvider>
    );
}

function CustomBookingFormInner({ destinations, seasons }: CustomBookingFormProps) {
    const headingId = useId();
    const headingRef = useRef<HTMLHeadingElement>(null);
    const formTopRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const flashedSuccess = usePage().props.flash.customBookingSuccess;
    const { steps, stepCount } = useBookingTranslationContext();
    const { t } = useTranslations();
    const { data: state, setData, post, processing: submitting, transform } = useForm<CustomBookingState>(
        createInitialBookingState(),
    );
    const [step, setStep] = useState(0);
    const [maxReachableStep, setMaxReachableStep] = useState(0);
    const [errors, setErrors] = useState<BookingErrors>({});
    const [dirty, setDirty] = useState(false);
    const submittingRef = useRef(false);
    const stateRef = useRef(state);

    stateRef.current = state;

    const updateState = useCallback(
        (next: CustomBookingState) => {
            setDirty(true);
            setData(next);
            setErrors((current) => {
                const keys = Object.keys(current);
                if (keys.length === 0) {
                    return current;
                }

                const nextErrors = validateBookingStep(step, next);
                const merged: BookingErrors = {};

                keys.forEach((key) => {
                    if (nextErrors[key] !== undefined) {
                        merged[key] = nextErrors[key];
                    }
                });

                return merged;
            });
        },
        [setData, step],
    );

    const handleFieldBlur = (event: FocusEvent<HTMLFormElement>) => {
        const field = (event.target as HTMLElement).closest('[data-field]');
        const fieldId = field?.getAttribute('data-field');

        if (!field || !fieldId) {
            return;
        }

        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && field.contains(nextTarget)) {
            return;
        }

        const next = validateBookingStep(step, stateRef.current);

        setErrors((current) => {
            if (!(fieldId in current) && next[fieldId] === undefined) {
                return current;
            }

            const merged = { ...current };

            if (next[fieldId] !== undefined) {
                merged[fieldId] = next[fieldId];
            } else {
                delete merged[fieldId];
            }

            return merged;
        });
    };

    const goToStep = useCallback(
        (nextStep: number, options?: { clearErrors?: boolean }) => {
            setStep(nextStep);
            if (options?.clearErrors !== false) {
                setErrors({});
            }
            window.requestAnimationFrame(() => {
                formTopRef.current?.scrollIntoView({
                    block: 'start',
                    behavior: reducedMotion ? 'auto' : 'smooth',
                });
                if (options?.clearErrors !== false) {
                    headingRef.current?.focus();
                }
            });
        },
        [reducedMotion],
    );

    useEffect(() => {
        if (!dirty || flashedSuccess) {
            return;
        }

        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, [dirty, flashedSuccess]);

    const current = steps[step];
    const isLastStep = step === stepCount - 1;
    const canSubmit = hasRequiredAgreements(state);

    const handleNext = () => {
        const nextErrors = validateBookingStep(step, state);

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            const fieldId = firstErrorField(nextErrors);
            if (fieldId) {
                window.requestAnimationFrame(() => focusField(fieldId));
            }
            return;
        }

        setErrors({});
        const nextStep = Math.min(step + 1, stepCount - 1);
        setMaxReachableStep((currentMax) => Math.max(currentMax, nextStep));
        goToStep(nextStep);
    };

    const handleBack = () => {
        goToStep(Math.max(0, step - 1));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submittingRef.current || submitting || flashedSuccess) {
            return;
        }

        if (!isLastStep) {
            handleNext();
            return;
        }

        if (!canSubmit) {
            setErrors(validateBookingStep(step, state));
            window.requestAnimationFrame(() => focusField('agreements-accuracy'));
            return;
        }

        const invalid = validateAllBookingSteps(state);

        if (invalid) {
            setErrors(invalid.errors);
            if (invalid.step !== step) {
                goToStep(invalid.step, { clearErrors: false });
            }
            const fieldId = firstErrorField(invalid.errors);
            if (fieldId) {
                window.setTimeout(() => focusField(fieldId), 0);
            }
            return;
        }

        submittingRef.current = true;
        setErrors({});

        transform((current) => buildBookingPayload(current));
        post('/booking', {
            preserveScroll: true,
            onError: (serverErrors) => {
                const mapped = mapServerBookingErrors(serverErrors);
                setErrors(mapped);
                const fieldId = firstErrorField(mapped);
                if (fieldId) {
                    const errorStep = stepForErrorField(fieldId);
                    if (errorStep !== step) {
                        goToStep(errorStep, { clearErrors: false });
                    }
                    window.setTimeout(() => focusField(fieldId), 0);
                }
            },
            onFinish: () => {
                submittingRef.current = false;
            },
            onSuccess: () => {
                setDirty(false);
            },
        });
    };

    if (flashedSuccess) {
        return <BookingSuccess summary={flashedSuccess} />;
    }

    return (
        <div ref={formTopRef} className="scroll-mt-28">
            <BookingStepper
                currentStep={step}
                maxReachableStep={maxReachableStep}
                onStepSelect={(nextStep) => {
                    if (nextStep < step) {
                        goToStep(nextStep);
                        return;
                    }

                    const nextErrors = validateBookingStep(step, state);
                    if (Object.keys(nextErrors).length > 0) {
                        setErrors(nextErrors);
                        const fieldId = firstErrorField(nextErrors);
                        if (fieldId) {
                            window.requestAnimationFrame(() => focusField(fieldId));
                        }
                        return;
                    }

                    goToStep(nextStep);
                }}
            />

            <form
                onSubmit={handleSubmit}
                onBlur={handleFieldBlur}
                noValidate
                className="px-4 py-6 sm:px-6 sm:py-8"
            >
                <h2
                    ref={headingRef}
                    id={headingId}
                    tabIndex={-1}
                    className={cn(
                        'font-heading text-xl font-semibold tracking-tight text-foreground outline-none',
                        (step === 0 || step === 1) && 'sr-only',
                    )}
                >
                    {step === 4 ? 'Emergency Contact' : step === 3 ? 'Passport Information' : current?.title}
                </h2>
                {step === 5 ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        This is a custom tour request. Submitting it does not reserve a seat or confirm a trip.
                    </p>
                ) : null}

                <BookingStepErrorBanner count={Object.keys(errors).length} />

                <div className={cn(step === 0 || step === 1 ? 'mt-2' : 'mt-8')}>
                    {step === 0 ? (
                        <TripPreferencesStep
                            state={state}
                            errors={errors}
                            destinations={destinations}
                            seasons={seasons}
                            onChange={updateState}
                        />
                    ) : null}
                    {step === 1 ? (
                        <TravelersStep state={state} errors={errors} onChange={updateState} />
                    ) : null}
                    {step === 2 ? (
                        <ServicesStep state={state} errors={errors} onChange={updateState} />
                    ) : null}
                    {step === 3 ? (
                        <TravelDocumentsStep state={state} errors={errors} onChange={updateState} />
                    ) : null}
                    {step === 4 ? (
                        <RequirementsStep state={state} errors={errors} onChange={updateState} />
                    ) : null}
                    {step === 5 ? (
                        <ReviewStep
                            state={state}
                            errors={errors}
                            seasons={seasons}
                            onChange={updateState}
                            onEdit={goToStep}
                        />
                    ) : null}
                </div>

                <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
                            {t('buttons.back')}
                        </button>
                    ) : (
                        <span />
                    )}

                    {isLastStep ? (
                        <div className="flex flex-col items-stretch gap-2 sm:items-end">
                            {!canSubmit ? (
                                <p id="booking-submit-hint" className="text-xs text-muted-foreground sm:text-end">
                                    {t('booking.submitHint')}
                                </p>
                            ) : null}
                            <button
                                type="submit"
                                disabled={submitting || !canSubmit}
                                aria-busy={submitting}
                                aria-describedby={!canSubmit ? 'booking-submit-hint' : undefined}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? (
                                    <Loader2 className="size-4 animate-spin" aria-hidden />
                                ) : (
                                    <Send className="size-4" aria-hidden />
                                )}
                                {submitting ? t('buttons.sendingRequest') : t('buttons.requestMyCustomTour')}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('buttons.continue')}
                            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
