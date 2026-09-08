<?php

namespace Tests\Unit\Support;

use App\Support\Translatable;
use Tests\TestCase;

class TranslatableTest extends TestCase
{
    public function test_normalize_includes_german_and_french_keys(): void
    {
        $normalized = Translatable::normalize(['en' => 'English title']);

        $this->assertSame('English title', $normalized['en']);
        $this->assertSame('', $normalized['fa']);
        $this->assertSame('', $normalized['ps']);
        $this->assertSame('', $normalized['de']);
        $this->assertSame('', $normalized['fr']);
        $this->assertSame(['en', 'fa', 'ps', 'de', 'fr'], array_keys($normalized));
    }

    public function test_resolve_returns_the_active_locale_when_present(): void
    {
        $value = [
            'en' => 'English title',
            'fa' => 'عنوان دری',
            'ps' => 'پښتو سرلیک',
        ];

        app()->setLocale('fa');

        $this->assertSame('عنوان دری', Translatable::resolve($value));
    }

    public function test_resolve_falls_back_to_english_when_active_locale_is_missing(): void
    {
        $value = [
            'en' => 'English title',
            'fa' => '',
            'ps' => '',
        ];

        app()->setLocale('fa');

        $this->assertSame('English title', Translatable::resolve($value));
    }

    public function test_resolve_string_list_falls_back_to_english(): void
    {
        $value = [
            'en' => ['English highlight'],
            'fa' => [],
            'ps' => ['پښتو ټکی'],
        ];

        app()->setLocale('fa');

        $this->assertSame(['English highlight'], Translatable::resolveStringList($value));
    }

    public function test_resolve_string_list_returns_the_active_locale_when_present(): void
    {
        $value = [
            'en' => ['English highlight'],
            'fa' => ['نکته دری'],
            'ps' => ['پښتو ټکی'],
        ];

        app()->setLocale('ps');

        $this->assertSame(['پښتو ټکی'], Translatable::resolveStringList($value));
    }

    public function test_resolve_json_list_returns_the_active_locale_when_present(): void
    {
        $value = [
            'en' => [['day' => 'Day 1', 'title' => 'Kabul']],
            'fa' => [['day' => 'روز ۱', 'title' => 'کابل']],
            'ps' => [],
        ];

        app()->setLocale('fa');

        $this->assertSame([['day' => 'روز ۱', 'title' => 'کابل']], Translatable::resolveJsonList($value));
    }

    public function test_resolve_json_list_falls_back_to_english_when_active_locale_is_empty(): void
    {
        $value = [
            'en' => [['day' => 'Day 1', 'title' => 'Kabul']],
            'fa' => [],
            'ps' => [],
        ];

        app()->setLocale('ps');

        $this->assertSame([['day' => 'Day 1', 'title' => 'Kabul']], Translatable::resolveJsonList($value));
    }
}
