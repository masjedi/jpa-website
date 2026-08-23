<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('status', 20);
            $table->string('name');
            $table->string('tagline');
            $table->string('region');
            $table->string('badge')->nullable();
            $table->json('cover_media')->nullable();
            $table->longText('description');
            $table->json('highlights');
            $table->string('best_season')->nullable();
            $table->string('travel_style')->nullable();
            $table->json('practical_notes');
            $table->json('tour_match_keywords');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->index('status');
            $table->index('region');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
