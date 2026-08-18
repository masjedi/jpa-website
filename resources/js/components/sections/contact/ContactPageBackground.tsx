import { useDeferredScanner } from '@/lib/deferredScanner';

function ContactGradientFallback() {
    return (
        <>
            <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(160deg,var(--brand-deep)_0%,#0a2a42_40%,var(--turquoise-500)_100%)]"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(215,162,58,0.14),transparent_50%)]"
            />
        </>
    );
}

export function ContactPageBackground() {
    const Scanner = useDeferredScanner();

    if (!Scanner) {
        return <ContactGradientFallback />;
    }

    return (
        <>
            <Scanner
                className="absolute inset-0 z-0"
                color1="#071722"
                color2="#0E7373"
                color3="#d7a23a"
                speed={0.28}
                sweepSpeed={0.14}
                sweepWidth={1.4}
                sweepFalloff={6}
                scale={1.6}
                frequency={1.6}
                ripple={0.12}
                bandDensity={9}
                lineSharpness={4}
                glow={0.28}
                scanDirection="vertical"
                colorSpread={0.55}
                brightness={1.05}
                contrast={1.1}
                softness={1.6}
                vignette={0.5}
                scanline
                grain
                grainIntensity={0.02}
                opacity={0.85}
                mouseInteraction
                mouseRadius={0.45}
                mouseStrength={0.25}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(7,23,34,0.35)_70%,rgba(7,23,34,0.72)_100%)]"
            />
        </>
    );
}
