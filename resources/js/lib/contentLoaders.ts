import type { TravelOfferDetail } from '@/types/travelOffer';

export async function loadTourOfferBySlug(slug: string): Promise<TravelOfferDetail | undefined> {
    const { getTravelOfferByTourSlug } = await import('@/lib/travelOfferMappers');
    return getTravelOfferByTourSlug(slug);
}

export async function loadPackageOfferBySlug(slug: string): Promise<TravelOfferDetail | undefined> {
    const { getTravelOfferByPackageSlug } = await import('@/lib/travelOfferMappers');
    return getTravelOfferByPackageSlug(slug);
}
