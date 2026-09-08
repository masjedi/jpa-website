<?php

namespace Tests\Unit\Seo;

use App\Support\Seo\SeoCopy;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SeoCopyTest extends TestCase
{
    #[Test]
    public function it_strips_html_and_normalizes_whitespace(): void
    {
        $plain = SeoCopy::plainText('<p>Explore Kabul   and<br>Bamiyan</p>');

        $this->assertSame('Explore Kabul and Bamiyan', $plain);
    }

    #[Test]
    public function it_creates_a_readable_excerpt_without_cutting_words(): void
    {
        $source = 'Explore private Afghanistan tours with trusted local guides. Discover Kabul, Bamiyan, Herat, Panjshir and more through carefully planned journeys across highland roads.';

        $excerpt = SeoCopy::excerpt($source);

        $this->assertNotSame('', $excerpt);
        $this->assertGreaterThanOrEqual(140, mb_strlen($excerpt));
        $this->assertLessThanOrEqual(160, mb_strlen($excerpt));
        $this->assertStringNotContainsString('<', $excerpt);
        $this->assertStringNotContainsString('highland', $excerpt);
        $this->assertStringContainsString($excerpt, $source);
    }
}
