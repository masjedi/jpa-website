import { useMemo } from 'react';

import {
    ACCOMMODATION_LEVEL_OPTIONS,
    CONTACT_METHOD_OPTIONS,
    DATE_FLEXIBILITY_OPTIONS,
    DIETARY_OPTIONS,
    DOMESTIC_TRAVEL_OPTIONS,
    FLIGHT_ASSISTANCE_OPTIONS,
    GROUP_TYPE_OPTIONS,
    GUIDE_GENDER_OPTIONS,
    GUIDE_LANGUAGE_OPTIONS,
    INSURANCE_STATUS_OPTIONS,
    RECOMMEND_SEASON_VALUE,
    ROUTE_PREFERENCE_OPTIONS,
    SERVICE_OPTIONS,
    TRANSPORT_COVERAGE_OPTIONS,
    TRAVEL_INTEREST_OPTIONS,
    VEHICLE_OPTIONS,
    VISA_STATUS_OPTIONS,
    ROOM_PREFERENCE_OPTIONS,
    type ChoiceOption,
} from '@/components/sections/booking/bookingOptions';
import { useTranslations } from '@/hooks/use-translations';
import type {
    AccommodationLevel,
    DateFlexibility,
    DietaryRequirement,
    DomesticTravelPreference,
    FlightAssistance,
    GroupType,
    GuideGender,
    GuideLanguage,
    InsuranceStatus,
    PreferredContactMethod,
    RoomPreference,
    RoutePreference,
    TransportCoverage,
    TravelInterest,
    VehiclePreference,
    VisaStatus,
} from '@/types/customBooking';

function mapOptions<T extends string>(
    options: readonly ChoiceOption<T>[],
    labelMap: Record<T, string>,
    descriptionMap?: Partial<Record<T, string>>,
): ChoiceOption<T>[] {
    return options.map((option) => ({
        ...option,
        label: labelMap[option.value],
        description: descriptionMap?.[option.value] ?? option.description,
    }));
}

export function useBookingTranslations() {
    const { t } = useTranslations();

    return useMemo(() => {
        const steps = [
            { id: 'trip', title: t('booking.steps.trip.title'), shortTitle: t('booking.steps.trip.short') },
            { id: 'travelers', title: t('booking.steps.travelers.title'), shortTitle: t('booking.steps.travelers.short') },
            { id: 'services', title: t('booking.steps.services.title'), shortTitle: t('booking.steps.services.short') },
            { id: 'documents', title: t('booking.steps.documents.title'), shortTitle: t('booking.steps.documents.short') },
            { id: 'requirements', title: t('booking.steps.requirements.title'), shortTitle: t('booking.steps.requirements.short') },
            { id: 'review', title: t('booking.steps.review.title'), shortTitle: t('booking.steps.review.short') },
        ] as const;

        const dateFlexibilityOptions = mapOptions<DateFlexibility>(DATE_FLEXIBILITY_OPTIONS, {
            exact: t('booking.options.exactDate'),
            plus_minus_3: t('booking.options.flex3Days'),
            plus_minus_week: t('booking.options.flexWeek'),
            within_month: t('booking.options.flexMonth'),
            unsure: t('booking.options.unsure'),
        });

        const travelInterestOptions = mapOptions<TravelInterest>(TRAVEL_INTEREST_OPTIONS, {
            culture: t('booking.options.culture'),
            nature: t('booking.options.nature'),
            adventure: t('booking.options.adventure'),
            photography: t('booking.options.photography'),
            communities: t('booking.options.communities'),
            food: t('booking.options.food'),
        });

        const routePreferenceOptions = mapOptions<RoutePreference>(
            ROUTE_PREFERENCE_OPTIONS,
            {
                know: t('booking.options.routeKnow'),
                recommend: t('booking.options.routeRecommend'),
                mix: t('booking.options.routeMix'),
            },
            {
                know: t('booking.options.routeKnowDesc'),
                recommend: t('booking.options.routeRecommendDesc'),
                mix: t('booking.options.routeMixDesc'),
            },
        );

        const groupTypeOptions = mapOptions<GroupType>(GROUP_TYPE_OPTIONS, {
            solo: t('booking.options.solo'),
            couple: t('booking.options.couple'),
            family: t('booking.options.family'),
            friends: t('booking.options.friends'),
            private_group: t('booking.options.privateGroup'),
        });

        const serviceOptions = SERVICE_OPTIONS.map((option) => {
            const labels: Record<(typeof SERVICE_OPTIONS)[number]['key'], string> = {
                guide: t('booking.options.guide'),
                transportation: t('booking.options.transportation'),
                accommodation: t('booking.options.accommodation'),
                airport: t('booking.options.airport'),
                domestic: t('booking.options.domestic'),
            };

            const descriptions: Record<(typeof SERVICE_OPTIONS)[number]['key'], string> = {
                guide: t('booking.options.guideDesc'),
                transportation: t('booking.options.transportationDesc'),
                accommodation: t('booking.options.accommodationDesc'),
                airport: t('booking.options.airportDesc'),
                domestic: t('booking.options.domesticDesc'),
            };

            return {
                ...option,
                label: labels[option.key],
                description: descriptions[option.key],
            };
        });

        const guideGenderOptions = mapOptions<GuideGender>(GUIDE_GENDER_OPTIONS, {
            male: t('booking.options.male'),
            female: t('booking.options.female'),
        });

        const guideLanguageOptions = mapOptions<GuideLanguage>(GUIDE_LANGUAGE_OPTIONS, {
            english: t('booking.options.english'),
            dari: t('booking.options.dari'),
            pashto: t('booking.options.pashto'),
            german: t('booking.options.german'),
            other: t('booking.options.other'),
        });

        const vehicleOptions = mapOptions<VehiclePreference>(VEHICLE_OPTIONS, {
            standard: t('booking.options.standardCar'),
            suv: t('booking.options.suv'),
            minivan: t('booking.options.minivan'),
            larger: t('booking.options.largerVehicle'),
            recommend: t('booking.options.recommendVehicle'),
        });

        const transportCoverageOptions = mapOptions<TransportCoverage>(TRANSPORT_COVERAGE_OPTIONS, {
            entire: t('booking.options.entireTrip'),
            selected: t('booking.options.selectedDays'),
            airport_only: t('booking.options.airportOnly'),
        });

        const accommodationLevelOptions = mapOptions<AccommodationLevel>(ACCOMMODATION_LEVEL_OPTIONS, {
            standard: t('booking.options.standard'),
            comfortable: t('booking.options.comfortable'),
            premium: t('booking.options.premium'),
            recommend: t('booking.options.recommendAccommodation'),
        });

        const roomPreferenceOptions = mapOptions<RoomPreference>(ROOM_PREFERENCE_OPTIONS, {
            single: t('booking.options.single'),
            double: t('booking.options.double'),
            twin: t('booking.options.twin'),
            family: t('booking.options.familyRooms'),
        });

        const flightAssistanceOptions = mapOptions<FlightAssistance>(FLIGHT_ASSISTANCE_OPTIONS, {
            yes: t('booking.options.yes'),
            no: t('booking.options.no'),
            not_yet: t('booking.options.flightNotYet'),
        });

        const domesticTravelOptions = mapOptions<DomesticTravelPreference>(DOMESTIC_TRAVEL_OPTIONS, {
            road: t('booking.options.road'),
            flight: t('booking.options.domesticFlight'),
            recommend: t('booking.options.recommendOption'),
        });

        const visaStatusOptions = mapOptions<VisaStatus>(VISA_STATUS_OPTIONS, {
            obtained: t('booking.options.visaObtained'),
            applying: t('booking.options.visaApplying'),
            guidance: t('booking.options.visaGuidance'),
            not_started: t('booking.options.visaNotStarted'),
        });

        const insuranceStatusOptions = mapOptions<InsuranceStatus>(INSURANCE_STATUS_OPTIONS, {
            arranged: t('booking.options.insuranceArranged'),
            will_arrange: t('booking.options.insuranceWillArrange'),
            guidance: t('booking.options.insuranceGuidance'),
        });

        const dietaryOptions = mapOptions<DietaryRequirement>(DIETARY_OPTIONS, {
            none: t('booking.options.dietaryNone'),
            vegetarian: t('booking.options.vegetarian'),
            vegan: t('booking.options.vegan'),
            halal: t('booking.options.halal'),
            gluten_free: t('booking.options.glutenFree'),
            allergy: t('booking.options.allergy'),
            other: t('booking.options.other'),
        });

        const contactMethodOptions = mapOptions<PreferredContactMethod>(CONTACT_METHOD_OPTIONS, {
            email: t('booking.options.email'),
            whatsapp: t('booking.options.whatsapp'),
            phone: t('booking.options.phone'),
        });

        const seasonRecommendLabel = t('booking.options.recommendSeason');

        return {
            steps,
            stepCount: steps.length,
            dateFlexibilityOptions,
            travelInterestOptions,
            routePreferenceOptions,
            groupTypeOptions,
            serviceOptions,
            guideGenderOptions,
            guideLanguageOptions,
            vehicleOptions,
            transportCoverageOptions,
            accommodationLevelOptions,
            roomPreferenceOptions,
            flightAssistanceOptions,
            domesticTravelOptions,
            visaStatusOptions,
            insuranceStatusOptions,
            dietaryOptions,
            contactMethodOptions,
            seasonRecommendLabel,
            recommendSeasonValue: RECOMMEND_SEASON_VALUE,
        };
    }, [t]);
}
