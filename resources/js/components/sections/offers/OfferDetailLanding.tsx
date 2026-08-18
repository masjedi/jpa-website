import { useState } from 'react';

import { OfferDetailBody } from '@/components/sections/offers/OfferDetailBody';
import { OfferDetailHero } from '@/components/sections/offers/OfferDetailHero';
import { TourInquiryModal } from '@/components/sections/tours/TourInquiryModal';
import type { TravelOfferDetail } from '@/types/travelOffer';
import type { InquiryFormData } from '@/types/tours';

interface OfferDetailLandingProps {
    offer: TravelOfferDetail;
}

export function OfferDetailLanding({ offer }: OfferDetailLandingProps) {
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryInitialData, setInquiryInitialData] = useState<InquiryFormData>({
        tourTitle: offer.title,
        preferredDate: offer.inquiryPreferredDate ?? '',
        travelerCount: '2',
    });

    const handleRequest = () => {
        setInquiryInitialData({
            tourTitle: offer.title,
            preferredDate: offer.inquiryPreferredDate ?? '',
            travelerCount: '2',
        });
        setInquiryModalOpen(true);
    };

    return (
        <div className="w-full">
            <OfferDetailHero offer={offer} onRequest={handleRequest} />
            <OfferDetailBody offer={offer} onRequest={handleRequest} />
            <TourInquiryModal
                isOpen={inquiryModalOpen}
                onClose={() => setInquiryModalOpen(false)}
                initialData={inquiryInitialData}
            />
        </div>
    );
}
