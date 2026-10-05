import type { LucideIcon } from 'lucide-react';
import {
    BedDouble,
    Bus,
    FileCheck2,
    MapPinned,
    Route,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';

const serviceIconMap: Record<string, LucideIcon> = {
    users: Users,
    route: Route,
    'user-check': UserCheck,
    'map-pinned': MapPinned,
    bus: Bus,
    'bed-double': BedDouble,
    'file-check-2': FileCheck2,
    'shield-check': ShieldCheck,
};

export function resolveServiceIcon(iconKey: string): LucideIcon {
    return serviceIconMap[iconKey] ?? Users;
}
