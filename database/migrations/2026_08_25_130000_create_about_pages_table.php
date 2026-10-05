<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_pages', function (Blueprint $table) {
            $table->id();
            $table->string('intro_eyebrow');
            $table->string('intro_title');
            $table->text('intro_description');
            $table->string('mission_section_eyebrow');
            $table->string('mission_section_title');
            $table->string('mission_title');
            $table->text('mission_description');
            $table->string('vision_title');
            $table->text('vision_description');
            $table->string('cta_eyebrow');
            $table->string('cta_title');
            $table->text('cta_description');
            $table->string('cta_primary_label');
            $table->string('cta_primary_href');
            $table->string('cta_secondary_label');
            $table->string('cta_secondary_href');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_pages');
    }
};
