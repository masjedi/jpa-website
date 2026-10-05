<?php

namespace App\Enums;

enum EmergencyType: string
{
    case PoliceSecurity = 'police_security';
    case HospitalMedical = 'hospital_medical';
    case ProvincialGovernment = 'provincial_government';
    case TourismInformation = 'tourism_information';
    case TransportRoad = 'transport_road';
    case Airport = 'airport';
    case FireRescue = 'fire_rescue';
    case EmbassyConsular = 'embassy_consular';
    case Other = 'other';

    public static function fromFrontend(string $value): self
    {
        foreach (self::cases() as $type) {
            if ($value === $type->value || $value === $type->frontendLabel()) {
                return $type;
            }
        }

        throw new \InvalidArgumentException("Invalid emergency type [{$value}].");
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $type): string => $type->value, self::cases());
    }

    /**
     * @return list<string>
     */
    public static function frontendValues(): array
    {
        return array_map(fn (self $type): string => $type->frontendLabel(), self::cases());
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $type): array => [
                'value' => $type->value,
                'label' => $type->frontendLabel(),
            ],
            self::cases(),
        );
    }

    public function frontendLabel(): string
    {
        return match ($this) {
            self::PoliceSecurity => 'Police / Security',
            self::HospitalMedical => 'Hospital / Medical',
            self::ProvincialGovernment => 'Provincial Government',
            self::TourismInformation => 'Tourism / Information',
            self::TransportRoad => 'Transport / Road Assistance',
            self::Airport => 'Airport',
            self::FireRescue => 'Fire / Rescue',
            self::EmbassyConsular => 'Embassy / Consular',
            self::Other => 'Other',
        };
    }
}
