import type { ArticleDetail } from '@/types/articles';
import type { Destination } from '@/types/destinations';
import type { TravelOfferDetail } from '@/types/travelOffer';

export async function loadArticleBySlug(slug: string): Promise<ArticleDetail | undefined> {
    const { getArticleBySlug } = await import('@/data/articlesData');
    return getArticleBySlug(slug);
}

export async function loadDestinationBySlug(slug: string): Promise<Destination | undefined> {
    const { getDestinationBySlug } = await import('@/data/destinationsData');
    return getDestinationBySlug(slug);
}

export async function loadTourOfferBySlug(slug: string): Promise<TravelOfferDetail | undefined> {
    const { getTravelOfferByTourSlug } = await import('@/lib/travelOfferMappers');
    return getTravelOfferByTourSlug(slug);
}

export async function loadPackageOfferBySlug(slug: string): Promise<TravelOfferDetail | undefined> {
    const { getTravelOfferByPackageSlug } = await import('@/lib/travelOfferMappers');
    return getTravelOfferByPackageSlug(slug);
}
