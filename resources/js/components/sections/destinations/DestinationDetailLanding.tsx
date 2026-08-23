import { useState } from 'react';

import { DestinationDetailBody } from '@/components/sections/destinations/DestinationDetailBody';
import { DestinationDetailHero } from '@/components/sections/destinations/DestinationDetailHero';
import { TourInquiryModal } from '@/components/sections/tours/TourInquiryModal';
import type {
    Destination,
    DestinationRelatedItem,
    DestinationRelatedTour,
} from '@/types/destinations';
import type { InquiryFormData } from '@/types/tours';

interface DestinationDetailLandingProps {
    destination: Destination;
    relatedTours: readonly DestinationRelatedTour[];
    relatedDestinations: readonly DestinationRelatedItem[];
}

export function DestinationDetailLanding({
    destination,
    relatedTours,
    relatedDestinations,
}: DestinationDetailLandingProps) {
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryInitialData, setInquiryInitialData] = useState<InquiryFormData>({
        tourTitle: `Trip to ${destination.name}`,
        preferredDate: '',
        travelerCount: '2',
    });

    const handlePlanTrip = () => {
        setInquiryInitialData({
            tourTitle: `Trip to ${destination.name}`,
            preferredDate: '',
            travelerCount: '2',
        });
        setInquiryModalOpen(true);
    };

    return (
        <div className="w-full">
            <DestinationDetailHero
                destination={destination}
                onPlanTrip={handlePlanTrip}
            />
            <DestinationDetailBody
                destination={destination}
                relatedTours={relatedTours}
                relatedDestinations={relatedDestinations}
                onPlanTrip={handlePlanTrip}
            />
            <TourInquiryModal
                isOpen={inquiryModalOpen}
                onClose={() => setInquiryModalOpen(false)}
                initialData={inquiryInitialData}
            />
        </div>
    );
}
