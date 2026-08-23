import { useState } from 'react';

import { TourInquiryModal } from '@/components/sections/tours/TourInquiryModal';
import { TourPackagesSection } from '@/components/sections/tours/TourPackagesSection';
import { ToursGridSection } from '@/components/sections/tours/ToursGridSection';
import { ToursHero } from '@/components/sections/tours/ToursHero';
import type { InquiryFormData, Tour, TourPackage } from '@/types/tours';

interface ToursLandingProps {
    tours: Tour[];
    packages: TourPackage[];
}

export function ToursLanding({ tours, packages }: ToursLandingProps) {
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryInitialData, setInquiryInitialData] = useState<InquiryFormData>({
        tourTitle: '',
        preferredDate: '',
        travelerCount: '2',
    });

    const handleOpenCustomInquiry = () => {
        setInquiryInitialData({
            tourTitle: 'Custom Tailored Itinerary',
            preferredDate: '',
            travelerCount: '2',
        });
        setInquiryModalOpen(true);
    };

    const handleSelectTour = (tour: Tour) => {
        setInquiryInitialData({
            tourTitle: tour.title,
            preferredDate: tour.nextDeparture.date,
            travelerCount: '2',
        });
        setInquiryModalOpen(true);
    };

    const handleSelectPackage = (pkg: TourPackage) => {
        setInquiryInitialData({
            tourTitle: pkg.title,
            preferredDate: '',
            travelerCount: '2',
        });
        setInquiryModalOpen(true);
    };

    return (
        <div className="w-full">
            <ToursHero onOpenCustomInquiry={handleOpenCustomInquiry} />
            <TourPackagesSection packages={packages} onSelectPackage={handleSelectPackage} />
            <ToursGridSection tours={tours} onSelectTour={handleSelectTour} />
            <TourInquiryModal
                isOpen={inquiryModalOpen}
                onClose={() => setInquiryModalOpen(false)}
                initialData={inquiryInitialData}
            />
        </div>
    );
}
