import { allTours } from '@/data/toursData';
import type { Destination } from '@/types/destinations';
import type { Tour } from '@/types/tours';

export function getToursForDestination(destination: Destination): Tour[] {
    return allTours.filter((tour) =>
        destination.tourMatchKeywords.some(
            (keyword) =>
                tour.destination.includes(keyword) ||
                tour.region.includes(keyword) ||
                tour.title.includes(keyword),
        ),
    );
}
