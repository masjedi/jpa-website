<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('brand_name');
            $table->string('contact_email');
            $table->string('whatsapp_display');
            $table->string('whatsapp_href');
            $table->string('office_location');
            $table->string('office_maps_href')->nullable();
            $table->string('office_maps_embed_src')->nullable();
            $table->json('social_links');
            $table->json('logo_color_media')->nullable();
            $table->json('logo_white_media')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
