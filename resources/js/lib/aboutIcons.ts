import type { LucideIcon } from 'lucide-react';
import {
    Compass,
    FileCheck2,
    HandHeart,
    Handshake,
    MapPinned,
    Route,
    ShieldCheck,
    Users,
} from 'lucide-react';

const aboutIconMap: Record<string, LucideIcon> = {
    compass: Compass,
    users: Users,
    'hand-heart': HandHeart,
    route: Route,
    'shield-check': ShieldCheck,
    'map-pinned': MapPinned,
    'file-check-2': FileCheck2,
    handshake: Handshake,
};

export function resolveAboutIcon(iconKey: string): LucideIcon {
    return aboutIconMap[iconKey] ?? Compass;
}

export const aboutIconOptions = Object.keys(aboutIconMap).map((value) => ({
    value,
    label: value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
}));
