import { Check } from 'lucide-react';

import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface BookingStepperProps {
    currentStep: number;
    onStepSelect?: (step: number) => void;
    maxReachableStep: number;
}

export function BookingStepper({ currentStep, onStepSelect, maxReachableStep }: BookingStepperProps) {
    const { steps, stepCount } = useBookingTranslationContext();
    const { t } = useTranslations();
    const current = steps[currentStep];

    return (
        <div className="border-b border-border px-4 py-4 sm:px-6">
            <p className="text-sm font-medium text-foreground lg:hidden">
                {t('booking.stepOf', { current: currentStep + 1, total: stepCount })}
                {current ? ` — ${current.title}` : ''}
            </p>

            <ol className="hidden lg:grid lg:grid-cols-6 lg:gap-2" aria-label={t('booking.stepsLabel')}>
                {steps.map((step, index) => {
                    const isCurrent = index === currentStep;
                    const isComplete = index < currentStep;
                    const isReachable = index <= maxReachableStep;

                    return (
                        <li key={step.id} className="min-w-0">
                            <button
                                type="button"
                                disabled={!isReachable}
                                aria-current={isCurrent ? 'step' : undefined}
                                onClick={() => {
                                    if (isReachable) {
                                        onStepSelect?.(index);
                                    }
                                }}
                                className={cn(
                                    'flex w-full min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default',
                                    isReachable && !isCurrent && 'hover:bg-surface-muted/60',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                                        isCurrent && 'bg-secondary text-white',
                                        isComplete && 'bg-secondary/15 text-secondary',
                                        !isCurrent && !isComplete && 'bg-surface-muted text-muted-foreground',
                                    )}
                                >
                                    {isComplete ? <Check className="size-3.5" aria-hidden /> : index + 1}
                                </span>
                                <span
                                    className={cn(
                                        'truncate text-xs font-medium',
                                        isCurrent ? 'text-foreground' : 'text-muted-foreground',
                                    )}
                                >
                                    {step.shortTitle}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
