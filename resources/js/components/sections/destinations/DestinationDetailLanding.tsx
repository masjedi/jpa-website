import { useState } from 'react';

import { DestinationDetailBody } from '@/components/sections/destinations/DestinationDetailBody';
import { DestinationDetailHero } from '@/components/sections/destinations/DestinationDetailHero';
import { TourInquiryModal } from '@/components/sections/tours/TourInquiryModal';
import type { Destination } from '@/types/destinations';
import type { InquiryFormData } from '@/types/tours';

interface DestinationDetailLandingProps {
    destination: Destination;
}

export function DestinationDetailLanding({
    destination,
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
