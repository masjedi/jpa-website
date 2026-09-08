<?php

namespace App\Support\Tours;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Models\Tour;
use App\Support\Translatable;

class TourFilterOptionAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated, ?string $existingValue = null): array
    {
        $name = Translatable::sanitize($validated['name']);
        $value = $existingValue ?? Translatable::resolve($name);

        return [
            'type' => TourFilterOptionType::fromFrontend((string) $validated['type']),
            'name' => $name,
            'value' => $value,
            'status' => TourFilterOptionStatus::fromFrontend((string) $validated['status']),
        ];
    }

    public static function syncRenamedValue(
        TourFilterOptionType $type,
        string $previousValue,
        string $nextValue,
    ): void {
        if ($previousValue === $nextValue) {
            return;
        }

        $column = $type->tourColumn();

        if ($column === null) {
            return;
        }

        Tour::query()
            ->where($column, $previousValue)
            ->update([$column => $nextValue]);
    }
}
