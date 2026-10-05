<?php

namespace Tests;

use App\Support\Translatable;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->disableCookieEncryption();
    }

    /**
     * @return array<string, string>
     */
    protected function translation(string $english, string $fa = '', string $ps = ''): array
    {
        return Translatable::normalize([
            'en' => $english,
            'fa' => $fa,
            'ps' => $ps,
        ]);
    }

    /**
     * @return array<string, string>
     */
    protected function stringListText(string $english, string $fa = '', string $ps = ''): array
    {
        return $this->translation($english, $fa, $ps);
    }
}
