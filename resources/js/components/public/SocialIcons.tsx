import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function FacebookIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M14 8.5h2.5l-.4 2.8H14v8.7h-3V11.3H9V8.5h2V6.8c0-2.2 1.3-3.5 3.4-3.5.9 0 1.8.1 2.1.2v2.5h-1.4c-1 0-1.2.5-1.2 1.2V8.5Z" />
        </svg>
    );
}

export function YouTubeIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.6 12 4.6 12 4.6s-5.9 0-7.6.6a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.6 7.6.6 7.6.6s5.9 0 7.6-.6a2.8 2.8 0 0 0 2-2 29.4 29.4 0 0 0 .4-4.8 29.4 29.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
    );
}

export function LinkedInIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M6.5 9.5H3.8v10.7h2.7V9.5ZM5.15 4.6A1.55 1.55 0 1 0 5.15 7.7 1.55 1.55 0 0 0 5.15 4.6ZM20.2 20.2h-2.7v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.3h-2.7V9.5h2.6v1.3h.04c.36-.68 1.24-1.4 2.55-1.4 2.73 0 3.23 1.8 3.23 4.1v6.7Z" />
        </svg>
    );
}

export const socialIconComponents = {
    Instagram: InstagramIcon,
    Facebook: FacebookIcon,
    YouTube: YouTubeIcon,
    LinkedIn: LinkedInIcon,
} as const;
