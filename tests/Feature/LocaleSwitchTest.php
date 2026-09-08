<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleSwitchTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitor_can_switch_locale(): void
    {
        $this->from('/')
            ->post('/locale', ['locale' => 'fa'])
            ->assertRedirect('/');

        $this->assertSame('fa', session('locale'));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('locale', 'fa')
                ->where('direction', 'rtl'));
    }

    public function test_visitor_can_switch_to_german_without_rtl(): void
    {
        $this->from('/')
            ->post('/locale', ['locale' => 'de'])
            ->assertRedirect('/');

        $this->assertSame('de', session('locale'));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('locale', 'de')
                ->where('direction', 'ltr'));
    }

    public function test_visitor_can_switch_to_french_without_rtl(): void
    {
        $this->from('/')
            ->post('/locale', ['locale' => 'fr'])
            ->assertRedirect('/');

        $this->assertSame('fr', session('locale'));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('locale', 'fr')
                ->where('direction', 'ltr'));
    }

    public function test_invalid_locale_is_rejected(): void
    {
        $this->from('/')
            ->post('/locale', ['locale' => 'xx'])
            ->assertSessionHasErrors('locale');
    }
}
