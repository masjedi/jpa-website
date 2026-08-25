<?php

namespace App\Http\Requests\Concerns;

trait ProhibitsMassAssignmentFields
{
    /**
     * @return array<string, list<string>>
     */
    protected function prohibitedMassAssignmentRules(): array
    {
        return [
            'id' => ['prohibited'],
            'source' => ['prohibited'],
            'status' => ['prohibited'],
            'read_at' => ['prohibited'],
            'created_at' => ['prohibited'],
            'updated_at' => ['prohibited'],
        ];
    }
}
