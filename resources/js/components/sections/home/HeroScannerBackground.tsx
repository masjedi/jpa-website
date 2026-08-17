import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { Scanner } from "@/components/react-bits/Scanner/Scanner";

function HeroGradientFallback() {
    return (
        <>
            <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(135deg,var(--lapis-500)_0%,#0a2a42_45%,var(--turquoise-500)_100%)]"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,162,58,0.18),transparent_45%)]"
            />
        </>
    );
}

export function HeroScannerBackground() {
    const prefersReducedMotion = useReducedMotion();
    const [enableScanner, setEnableScanner] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        const update = () => {
            setEnableScanner(mediaQuery.matches);
        };

        update();
        mediaQuery.addEventListener("change", update);

        return () => {
            mediaQuery.removeEventListener("change", update);
        };
    }, []);

    if (prefersReducedMotion || !enableScanner) {
        return <HeroGradientFallback />;
    }

    return (
        <>
            <Scanner
                className="absolute inset-0"
                color1="#163B5C"
                color2="#0E7373"
                color3="#F7FAFC"
                speed={0.45}
                sweepSpeed={0.22}
                sweepWidth={1.6}
                sweepFalloff={6}
                scale={1.5}
                frequency={2}
                ripple={0.18}
                bandDensity={10}
                lineSharpness={5.5}
                glow={0.18}
                scanDirection="vertical"
                colorSpread={0.55}
                brightness={0.95}
                contrast={1.1}
                softness={1.5}
                vignette={0.55}
                scanline
                grain
                grainIntensity={0.035}
                opacity={0.72}
                mouseInteraction
                mouseRadius={0.5}
                mouseStrength={0.35}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,23,34,0.35)_55%,rgba(7,23,34,0.72)_100%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,162,58,0.14),transparent_42%)]"
            />
        </>
    );
}
