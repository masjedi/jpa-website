import { useDeferredScanner } from '@/lib/deferredScanner';

function HeroGradientFallback() {
    return (
        <>
            <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(135deg,var(--lapis-500)_0%,var(--brand-deep)_45%,var(--turquoise-500)_100%)]"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,162,58,0.18),transparent_45%)]"
            />
        </>
    );
}

export function HeroScannerBackground() {
    const Scanner = useDeferredScanner();

    if (!Scanner) {
        return <HeroGradientFallback />;
    }

    return (
        <>
            <Scanner
                className="absolute inset-0 z-0"
                color1="#0a2a42"
                color2="#0E7373"
                color3="#d7a23a"
                speed={0.45}
                sweepSpeed={0.22}
                sweepWidth={1.6}
                sweepFalloff={5}
                scale={1.45}
                frequency={2}
                ripple={0.2}
                bandDensity={11}
                lineSharpness={5}
                glow={0.34}
                scanDirection="vertical"
                colorSpread={0.62}
                brightness={1.15}
                contrast={1.15}
                softness={1.4}
                vignette={0.38}
                scanline
                grain
                grainIntensity={0.03}
                opacity={0.92}
                mouseInteraction
                mouseRadius={0.55}
                mouseStrength={0.4}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,23,34,0.18)_60%,rgba(7,23,34,0.45)_100%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,rgba(215,162,58,0.12),transparent_42%)]"
            />
        </>
    );
}
