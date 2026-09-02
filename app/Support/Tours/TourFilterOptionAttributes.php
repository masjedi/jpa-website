<?php

namespace App\Support\Tours;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Models\Tour;

class TourFilterOptionAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        return [
            'type' => TourFilterOptionType::fromFrontend((string) $validated['type']),
            'name' => trim((string) $validated['name']),
            'status' => TourFilterOptionStatus::fromFrontend((string) $validated['status']),
        ];
    }

    public static function syncRenamedValue(
        TourFilterOptionType $type,
        string $previousName,
        string $nextName,
    ): void {
        if ($previousName === $nextName) {
            return;
        }

        $column = $type->tourColumn();

        if ($column === null) {
            return;
        }

        Tour::query()
            ->where($column, $previousName)
            ->update([$column => $nextName]);
    }
}
