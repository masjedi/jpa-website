<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_journey_steps', function (Blueprint $table) {
            $table->id();
            $table->string('status', 20);
            $table->string('title');
            $table->text('description');
            $table->json('image_media')->nullable();
            $table->string('image_alt');
            $table->string('icon_key', 40);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('status');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_journey_steps');
    }
};
