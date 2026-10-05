import { useState } from 'react';

import { openSeasonalPackageRequest } from '@/components/public/CustomTourRequestHost';
import { OfferDetailBody } from '@/components/sections/offers/OfferDetailBody';
import { OfferDetailHero } from '@/components/sections/offers/OfferDetailHero';
import { TourInquiryModal } from '@/components/sections/tours/TourInquiryModal';
import type { TravelOfferDetail } from '@/types/travelOffer';
import type { InquiryFormData } from '@/types/tours';

interface OfferDetailLandingProps {
    offer: TravelOfferDetail;
}

export function OfferDetailLanding({ offer }: OfferDetailLandingProps) {
    const isPackage = offer.kind === 'package';
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryInitialData, setInquiryInitialData] = useState<InquiryFormData>({
        tourTitle: offer.title,
        preferredDate: '',
        travelerCount: '2',
    });

    const handleRequest = () => {
        if (isPackage) {
            openSeasonalPackageRequest(offer.title, offer.priceLabel ?? '');
            return;
        }

        setInquiryInitialData({
            tourTitle: offer.title,
            preferredDate: '',
            travelerCount: '2',
        });
        setInquiryModalOpen(true);
    };

    return (
        <div className="w-full">
            <OfferDetailHero offer={offer} onRequest={handleRequest} />
            <OfferDetailBody offer={offer} onRequest={handleRequest} />
            {!isPackage ? (
                <TourInquiryModal
                    isOpen={inquiryModalOpen}
                    onClose={() => setInquiryModalOpen(false)}
                    initialData={inquiryInitialData}
                />
            ) : null}
        </div>
    );
}
