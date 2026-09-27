import { router, useForm } from '@inertiajs/react';
import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';

import type { SeasonalPackageRequestContext } from '@/components/public/CustomTourRequestHost';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { cn } from '@/lib/utils';
import type { CustomBookingSuccess } from '@/types/customBooking';

const sectionTitleClass = 'font-heading text-base font-semibold text-primary sm:text-lg';
const labelClass = 'text-sm font-normal text-primary sm:pt-1.5 sm:leading-snug';
const fieldClass =
    'w-full rounded-md border-2 border-border bg-transparent px-3 py-1.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus';
const checkboxLabelClass = 'inline-flex items-center gap-2 text-sm font-normal text-foreground';
const rowClass = 'grid gap-1.5 sm:grid-cols-[minmax(9.5rem,30%)_1fr] sm:items-start sm:gap-x-3';

interface CustomTourRequestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    packageContext?: SeasonalPackageRequestContext | null;
}

type TourType = 'group' | 'individual' | '';
type GuidePreference = 'male' | 'female' | 'no_preference' | '';
type TouristGender = 'male' | 'female';

const emptyForm = {
    request_kind: 'custom_tour' as 'custom_tour' | 'seasonal_package',
    package_title: '',
    package_price: '',
    full_name: '',
    email: '',
    phone: '',
    passport_number: '',
    country: '',
    tour_type: '' as TourType,
    number_of_tourists: '',
    tourist_genders: [] as TouristGender[],
    guide_preference: '' as GuidePreference,
    preferred_date: '',
    preferred_date_end: '',
    preferred_destinations: '',
    other_requests: '',
};

function destinationsPrefill(packageTitle: string): string {
    return packageTitle.slice(0, 50);
}

export function CustomTourRequestDialog({
    isOpen,
    onClose,
    packageContext = null,
}: CustomTourRequestDialogProps) {
    const titleId = useId();
    const firstFieldRef = useRef<HTMLInputElement>(null);
    const wasOpenRef = useRef(false);
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState<CustomBookingSuccess | null>(null);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({ ...emptyForm });
    const isSeasonalPackage = packageContext?.requestKind === 'seasonal_package';

    useLockBodyScroll(isOpen);

    useEffect(() => {
        if (!isOpen) {
            wasOpenRef.current = false;
            return;
        }

        const justOpened = !wasOpenRef.current;
        wasOpenRef.current = true;

        if (justOpened) {
            setSubmitted(false);
            setSuccess(null);
            clearErrors();
            reset();

            if (packageContext?.requestKind === 'seasonal_package') {
                setData({
                    ...emptyForm,
                    request_kind: 'seasonal_package',
                    package_title: packageContext.packageTitle,
                    package_price: packageContext.packagePrice ?? '',
                    preferred_destinations: destinationsPrefill(packageContext.packageTitle),
                });
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        if (justOpened) {
            window.setTimeout(() => firstFieldRef.current?.focus(), 0);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, clearErrors, reset, packageContext, setData]);

    if (!isOpen) {
        return null;
    }

    const isIndividual = data.tour_type === 'individual';

    const selectTourType = (type: TourType) => {
        if (type === 'individual') {
            setData({
                ...data,
                tour_type: type,
                number_of_tourists: '1',
            });
            return;
        }

        setData('tour_type', type);
    };

    const toggleGender = (gender: TouristGender) => {
        const current = data.tourist_genders;
        setData(
            'tourist_genders',
            current.includes(gender)
                ? current.filter((value) => value !== gender)
                : [...current, gender],
        );
    };

    const clearFlashFromPage = () => {
        router.reload({
            only: ['flash'],
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (processing || submitted) {
            return;
        }

        clearErrors();

        transform((formData) => ({
            ...formData,
            number_of_tourists:
                formData.tour_type === 'individual' ? '1' : formData.number_of_tourists,
            request_kind: isSeasonalPackage ? 'seasonal_package' : 'custom_tour',
            package_title: isSeasonalPackage ? packageContext?.packageTitle ?? formData.package_title : '',
            package_price: isSeasonalPackage ? packageContext?.packagePrice ?? formData.package_price : '',
        }));

        post('/booking', {
            preserveScroll: true,
            preserveState: true,
            only: ['errors', 'flash'],
            onSuccess: (page) => {
                const payload = page.props.flash.customBookingSuccess ?? null;
                setSuccess(payload);
                setSubmitted(true);
                reset();
            },
        });
    };

    const handleClose = () => {
        const hadSuccess = submitted || success !== null;
        setSubmitted(false);
        setSuccess(null);
        clearErrors();
        reset();
        onClose();

        if (hadSuccess) {
            clearFlashFromPage();
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden overscroll-none bg-black/60 p-4 backdrop-blur-sm sm:p-6"
            onClick={handleClose}
        >
            <div
                className="relative flex max-h-[min(92vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="relative shrink-0 border-b border-border px-6 py-5 sm:px-8">
                    <h2
                        id={titleId}
                        className="font-heading text-center text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
                    >
                        {isSeasonalPackage ? 'Seasonal Package Request' : 'Tour Request Form'}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="absolute end-4 top-4 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        aria-label="Close"
                    >
                        <X className="size-5" aria-hidden />
                    </button>
                </div>

                {submitted ? (
                    <div className="space-y-4 px-6 py-10 text-center sm:px-8">
                        <CheckCircle2 className="mx-auto size-12 text-secondary" aria-hidden />
                        <h3 className="font-heading text-xl font-semibold text-foreground">Request received</h3>
                        <p className="text-sm text-muted-foreground">
                            {success?.reference
                                ? `Reference ${success.reference}. Our team will reply soon.`
                                : 'Our team will review your request and reply soon.'}
                        </p>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        data-scroll-lock-scrollable
                        className="min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain px-6 py-2 sm:px-8"
                    >
                        {isSeasonalPackage ? (
                            <div className="mt-4 rounded-xl border border-secondary/25 bg-secondary/5 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                                    Seasonal package
                                </p>
                                <p className="font-heading mt-1 text-lg font-semibold text-foreground">
                                    {packageContext?.packageTitle}
                                </p>
                                {packageContext?.packagePrice ? (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Package price:{' '}
                                        <span className="font-semibold text-foreground">
                                            {packageContext.packagePrice}
                                        </span>
                                    </p>
                                ) : null}
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Complete the same traveler details as a custom tour request. This submission is
                                    for the seasonal package above.
                                </p>
                            </div>
                        ) : null}

                        <FormSection title="1. Personal Details">
                            <FieldRow id="full_name" label="Full Name" error={errors.full_name}>
                                <input
                                    ref={firstFieldRef}
                                    id="full_name"
                                    value={data.full_name}
                                    onChange={(event) => setData('full_name', event.target.value)}
                                    className={cn(fieldClass, errors.full_name && 'border-destructive')}
                                    maxLength={20}
                                    required
                                />
                            </FieldRow>
                            <FieldRow id="email" label="Email" error={errors.email}>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    className={cn(fieldClass, errors.email && 'border-destructive')}
                                    maxLength={50}
                                    required
                                    dir="ltr"
                                />
                            </FieldRow>
                            <FieldRow id="phone" label="Phone Number" error={errors.phone}>
                                <input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(event) => setData('phone', event.target.value)}
                                    className={cn(fieldClass, errors.phone && 'border-destructive')}
                                    placeholder="+491771234567"
                                    maxLength={20}
                                    required
                                    dir="ltr"
                                />
                            </FieldRow>
                            <FieldRow id="passport_number" label="Passport Number" error={errors.passport_number}>
                                <input
                                    id="passport_number"
                                    value={data.passport_number}
                                    onChange={(event) => setData('passport_number', event.target.value)}
                                    className={cn(fieldClass, errors.passport_number && 'border-destructive')}
                                    maxLength={20}
                                    required
                                    dir="ltr"
                                />
                            </FieldRow>
                            <FieldRow id="country" label="Country" error={errors.country}>
                                <input
                                    id="country"
                                    value={data.country}
                                    onChange={(event) => setData('country', event.target.value)}
                                    className={cn(fieldClass, errors.country && 'border-destructive')}
                                    maxLength={15}
                                    required
                                />
                            </FieldRow>
                        </FormSection>

                        <FormSection title="2. Tour Details">
                            <ChoiceRow label="Tour Type" error={errors.tour_type}>
                                {(['group', 'individual'] as const).map((type) => (
                                    <label key={type} className={checkboxLabelClass}>
                                        <input
                                            type="checkbox"
                                            checked={data.tour_type === type}
                                            onChange={() => selectTourType(type)}
                                            className="size-4 rounded border-border text-primary"
                                        />
                                        {type === 'group' ? 'Group' : 'Individual'}
                                    </label>
                                ))}
                            </ChoiceRow>
                            <FieldRow
                                id="number_of_tourists"
                                label="Number of Tourists"
                                error={errors.number_of_tourists}
                            >
                                <input
                                    id="number_of_tourists"
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={data.number_of_tourists}
                                    onChange={(event) => setData('number_of_tourists', event.target.value)}
                                    className={cn(
                                        fieldClass,
                                        errors.number_of_tourists && 'border-destructive',
                                        isIndividual && 'cursor-not-allowed opacity-60',
                                    )}
                                    required={!isIndividual}
                                    disabled={isIndividual}
                                    dir="ltr"
                                />
                            </FieldRow>
                            <ChoiceRow label="Tourists" error={errors.tourist_genders}>
                                {(['male', 'female'] as const).map((gender) => (
                                    <label key={gender} className={checkboxLabelClass}>
                                        <input
                                            type="checkbox"
                                            checked={data.tourist_genders.includes(gender)}
                                            onChange={() => toggleGender(gender)}
                                            className="size-4 rounded border-border text-primary"
                                        />
                                        {gender === 'male' ? 'Male' : 'Female'}
                                    </label>
                                ))}
                            </ChoiceRow>
                        </FormSection>

                        <FormSection title="3. Tour Guide">
                            <ChoiceRow label="Guide Preference" error={errors.guide_preference}>
                                {(
                                    [
                                        ['male', 'Male'],
                                        ['female', 'Female'],
                                        ['no_preference', 'No Preference'],
                                    ] as const
                                ).map(([value, label]) => (
                                    <label key={value} className={checkboxLabelClass}>
                                        <input
                                            type="checkbox"
                                            checked={data.guide_preference === value}
                                            onChange={() => setData('guide_preference', value)}
                                            className="size-4 rounded border-border text-primary"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </ChoiceRow>
                        </FormSection>

                        <FormSection title="4. Dates">
                            <FieldRow
                                id="preferred_date"
                                label="Preferred Date"
                                error={errors.preferred_date || errors.preferred_date_end}
                            >
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                                    <input
                                        id="preferred_date"
                                        type="date"
                                        value={data.preferred_date}
                                        onChange={(event) => {
                                            const start = event.target.value;
                                            setData({
                                                ...data,
                                                preferred_date: start,
                                                preferred_date_end:
                                                    data.preferred_date_end && data.preferred_date_end < start
                                                        ? start
                                                        : data.preferred_date_end,
                                            });
                                        }}
                                        className={cn(
                                            fieldClass,
                                            errors.preferred_date && 'border-destructive',
                                        )}
                                        dir="ltr"
                                        aria-label="Preferred start date"
                                    />
                                    <span className="hidden text-center text-sm text-muted-foreground sm:block">
                                        to
                                    </span>
                                    <input
                                        id="preferred_date_end"
                                        type="date"
                                        value={data.preferred_date_end}
                                        min={data.preferred_date || undefined}
                                        onChange={(event) =>
                                            setData('preferred_date_end', event.target.value)
                                        }
                                        className={cn(
                                            fieldClass,
                                            errors.preferred_date_end && 'border-destructive',
                                        )}
                                        dir="ltr"
                                        aria-label="Preferred end date"
                                    />
                                </div>
                            </FieldRow>
                        </FormSection>

                        <FormSection title="5. Destinations">
                            <FieldRow
                                id="preferred_destinations"
                                label="Preferred destination(s)"
                                error={errors.preferred_destinations}
                            >
                                <input
                                    id="preferred_destinations"
                                    value={data.preferred_destinations}
                                    onChange={(event) => setData('preferred_destinations', event.target.value)}
                                    className={cn(
                                        fieldClass,
                                        errors.preferred_destinations && 'border-destructive',
                                    )}
                                    maxLength={50}
                                    required
                                />
                            </FieldRow>
                        </FormSection>

                        <FormSection title="6. Other Requests" last>
                            <FieldRow
                                id="other_requests"
                                label="Special requirements or additional information"
                                error={errors.other_requests}
                                alignTop
                            >
                                <textarea
                                    id="other_requests"
                                    rows={4}
                                    value={data.other_requests}
                                    onChange={(event) => setData('other_requests', event.target.value)}
                                    className={cn(
                                        fieldClass,
                                        'min-h-24 resize-y',
                                        errors.other_requests && 'border-destructive',
                                    )}
                                    maxLength={100}
                                />
                            </FieldRow>
                        </FormSection>

                        <div className="sticky bottom-0 bg-surface py-5">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Submitting…'
                                    : isSeasonalPackage
                                      ? 'Submit Package Request'
                                      : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function FormSection({
    title,
    children,
    last = false,
}: {
    title: string;
    children: ReactNode;
    last?: boolean;
}) {
    return (
        <section className={cn('space-y-2.5 py-4', !last && 'border-b border-border')}>
            <h3 className={sectionTitleClass}>{title}</h3>
            <div className="space-y-2">{children}</div>
        </section>
    );
}

function FieldRow({
    id,
    label,
    error,
    children,
    alignTop = false,
}: {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
    alignTop?: boolean;
}) {
    return (
        <div className={cn(rowClass, alignTop && 'sm:items-start')}>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <div className="min-w-0">
                {children}
                {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
            </div>
        </div>
    );
}

function ChoiceRow({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className={rowClass}>
            <p className={labelClass}>{label}</p>
            <div className="min-w-0">
                <div className="flex min-h-8 flex-wrap items-center gap-x-5 gap-y-2">{children}</div>
                {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
            </div>
        </div>
    );
}
