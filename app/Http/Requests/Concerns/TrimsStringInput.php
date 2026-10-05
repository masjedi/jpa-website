<?php

namespace App\Http\Requests\Concerns;

trait TrimsStringInput
{
    /**
     * @param  list<string>  $keys
     */
    protected function trimStringInput(array $keys): void
    {
        $trimmed = [];

        foreach ($keys as $key) {
            $value = $this->input($key);

            if (is_string($value)) {
                $trimmed[$key] = trim($value);
            }
        }

        if ($trimmed !== []) {
            $this->merge($trimmed);
        }
    }

    /**
     * @param  list<string>  $keys
     */
    protected function nullifyEmptyStringInput(array $keys): void
    {
        $normalized = [];

        foreach ($keys as $key) {
            if ($this->input($key) === '') {
                $normalized[$key] = null;
            }
        }

        if ($normalized !== []) {
            $this->merge($normalized);
        }
    }
}
