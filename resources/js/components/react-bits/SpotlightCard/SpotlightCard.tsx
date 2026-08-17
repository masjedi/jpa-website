import {
    useRef,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from "react";

import "./SpotlightCard.css";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    spotlightColor?: string;
}

export function SpotlightCard({
    children,
    className = "",
    spotlightColor = "rgba(14, 115, 115, 0.2)",
    ...rest
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        const element = divRef.current;

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        element.style.setProperty("--mouse-x", `${x}px`);
        element.style.setProperty("--mouse-y", `${y}px`);
        element.style.setProperty("--spotlight-color", spotlightColor);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            className={`card-spotlight ${className}`.trim()}
            {...rest}
        >
            {children}
        </div>
    );
}
