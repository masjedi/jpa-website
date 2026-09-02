<?php

namespace App\Support\EmergencyContacts;

use App\Enums\EmergencyType;
use App\Http\Requests\Admin\EmergencyContactIndexRequest;
use App\Models\EmergencyContact;
use App\Models\Province;

class EmergencyContactPresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forAdminIndex(EmergencyContactIndexRequest $request): array
    {
        $filters = $request->filters();
        $contactTable = (new EmergencyContact)->getTable();
        $provinceTable = (new Province)->getTable();

        $contacts = EmergencyContact::query()
            ->select([
                "{$contactTable}.id",
                "{$contactTable}.province_id",
                "{$contactTable}.full_name",
                "{$contactTable}.position",
                "{$contactTable}.organization",
                "{$contactTable}.emergency_type",
                "{$contactTable}.primary_phone",
                "{$contactTable}.secondary_phone",
                "{$contactTable}.whatsapp",
                "{$contactTable}.availability_notes",
                "{$contactTable}.last_verified_at",
                "{$contactTable}.verified_by",
                "{$contactTable}.is_customer_shareable",
                "{$contactTable}.is_active",
                "{$contactTable}.internal_notes",
            ])
            ->with([
                'province:id,name',
                'verifiedBy:id,name',
            ])
            ->when($filters['search'] !== '', function ($query) use ($filters, $contactTable): void {
                $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $filters['search']).'%';
                $query->where(function ($query) use ($like, $contactTable): void {
                    $query->where("{$contactTable}.full_name", 'like', $like)
                        ->orWhere("{$contactTable}.organization", 'like', $like)
                        ->orWhere("{$contactTable}.position", 'like', $like)
                        ->orWhere("{$contactTable}.primary_phone", 'like', $like)
                        ->orWhere("{$contactTable}.secondary_phone", 'like', $like)
                        ->orWhere("{$contactTable}.whatsapp", 'like', $like);
                });
            })
            ->when($filters['province_id'] !== null, fn ($query) => $query->where("{$contactTable}.province_id", $filters['province_id']))
            ->when($filters['emergency_type'] !== null, fn ($query) => $query->where("{$contactTable}.emergency_type", $filters['emergency_type']))
            ->when($filters['is_active'] !== null, fn ($query) => $query->where("{$contactTable}.is_active", $filters['is_active']))
            ->when(
                $filters['is_customer_shareable'] !== null,
                fn ($query) => $query->where("{$contactTable}.is_customer_shareable", $filters['is_customer_shareable']),
            )
            ->when($filters['sort'] === 'province', function ($query) use ($filters, $contactTable, $provinceTable): void {
                $query->join($provinceTable, "{$provinceTable}.id", '=', "{$contactTable}.province_id")
                    ->orderBy("{$provinceTable}.name", $filters['direction'])
                    ->orderByDesc("{$contactTable}.id");
            }, function ($query) use ($filters, $contactTable): void {
                $query->orderBy("{$contactTable}.{$filters['sort']}", $filters['direction'])
                    ->orderByDesc("{$contactTable}.id");
            })
            ->paginate(15)
            ->withQueryString()
            ->through(fn (EmergencyContact $contact): array => self::adminPayload($contact));

        return [
            'contacts' => $contacts,
            'filters' => [
                'search' => $filters['search'],
                'province_id' => $filters['province_id'] !== null ? (string) $filters['province_id'] : '',
                'emergency_type' => $filters['emergency_type']?->value ?? '',
                'status' => $filters['status'],
                'shareable' => $filters['shareable'],
                'sort' => $filters['sort'],
                'direction' => $filters['direction'],
            ],
            'provinces' => self::provinceOptions(),
            'emergencyTypes' => EmergencyType::options(),
            'statusOptions' => EmergencyContactOptions::statusLabels(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(EmergencyContact $contact): array
    {
        $age = $contact->verificationAge();

        return [
            'id' => $contact->id,
            'provinceId' => $contact->province_id,
            'province' => (string) ($contact->province?->name ?? ''),
            'fullName' => (string) $contact->full_name,
            'position' => (string) $contact->position,
            'organization' => (string) $contact->organization,
            'emergencyType' => $contact->emergency_type->value,
            'emergencyTypeLabel' => $contact->emergency_type->frontendLabel(),
            'primaryPhone' => (string) $contact->primary_phone,
            'secondaryPhone' => (string) ($contact->secondary_phone ?? ''),
            'whatsapp' => (string) ($contact->whatsapp ?? ''),
            'availabilityNotes' => (string) ($contact->availability_notes ?? ''),
            'lastVerifiedAt' => $contact->last_verified_at?->toDateString() ?? '',
            'lastVerifiedLabel' => $contact->last_verified_at?->timezone(config('app.timezone'))->format('j M Y') ?? '',
            'verificationAge' => $age->value,
            'verificationAgeLabel' => $age->frontendLabel(),
            'verifiedByName' => (string) ($contact->verifiedBy?->name ?? ''),
            'status' => $contact->is_active
                ? EmergencyContactOptions::STATUS_ACTIVE
                : EmergencyContactOptions::STATUS_INACTIVE,
            'isCustomerShareable' => (bool) $contact->is_customer_shareable,
            'isEligibleForCustomerSharing' => $contact->isEligibleForCustomerSharing(),
            'internalNotes' => (string) ($contact->internal_notes ?? ''),
        ];
    }

    /**
     * Safe customer-facing payload. Not routed publicly; only active + shareable contacts are included.
     *
     * @return list<array<string, mixed>>
     */
    public static function forCustomerDirectory(?int $provinceId = null): array
    {
        $contactTable = (new EmergencyContact)->getTable();

        return EmergencyContact::query()
            ->shareableWithCustomers()
            ->select([
                "{$contactTable}.id",
                "{$contactTable}.province_id",
                "{$contactTable}.full_name",
                "{$contactTable}.organization",
                "{$contactTable}.emergency_type",
                "{$contactTable}.primary_phone",
                "{$contactTable}.availability_notes",
            ])
            ->with(['province:id,name'])
            ->when($provinceId !== null, fn ($query) => $query->where("{$contactTable}.province_id", $provinceId))
            ->orderBy("{$contactTable}.full_name")
            ->get()
            ->map(fn (EmergencyContact $contact): array => [
                'province' => (string) ($contact->province?->name ?? ''),
                'organization' => (string) $contact->organization,
                'emergencyType' => $contact->emergency_type->frontendLabel(),
                'fullName' => (string) $contact->full_name,
                'primaryPhone' => (string) $contact->primary_phone,
                'availabilityNotes' => (string) ($contact->availability_notes ?? ''),
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public static function provinceOptions(): array
    {
        return Province::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Province $province): array => [
                'id' => $province->id,
                'name' => (string) $province->name,
            ])
            ->values()
            ->all();
    }
}
