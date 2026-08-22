import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function NavigationProgress() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let hideTimer: number | undefined;

        const handleStart = () => {
            window.clearTimeout(hideTimer);
            setVisible(true);
            setProgress(12);
        };

        const handleProgress = (event: { detail: { progress?: { percentage?: number } } }) => {
            const percentage = event.detail.progress?.percentage;

            if (typeof percentage === 'number') {
                setProgress(Math.max(12, Math.min(percentage, 92)));
            }
        };

        const handleFinish = () => {
            setProgress(100);

            hideTimer = window.setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 180);
        };

        const removeStart = router.on('start', handleStart);
        const removeProgress = router.on('progress', handleProgress);
        const removeFinish = router.on('finish', handleFinish);

        return () => {
            window.clearTimeout(hideTimer);
            removeStart();
            removeProgress();
            removeFinish();
        };
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 bg-transparent"
        >
            <div
                className="h-full bg-secondary transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
