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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('listing_type', 20);
            $table->string('status', 20);
            $table->string('title');
            $table->string('tagline')->nullable();
            $table->text('summary');
            $table->string('destination')->nullable();
            $table->string('region')->nullable();
            $table->unsignedSmallInteger('duration_days')->default(0);
            $table->string('duration_label');
            $table->string('travel_style')->nullable();
            $table->string('difficulty')->nullable();
            $table->string('season')->nullable();
            $table->string('best_months')->nullable();
            $table->string('group_size')->nullable();
            $table->string('badge')->nullable();
            $table->json('cover_media')->nullable();
            $table->longText('content')->nullable();
            $table->json('highlights');
            $table->json('itinerary_overview')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('key_destinations')->nullable();
            $table->json('included_services')->nullable();
            $table->json('journey_outline')->nullable();
            $table->string('estimated_starting_price')->nullable();
            $table->string('price_estimate')->nullable();
            $table->string('ideal_for')->nullable();
            $table->string('next_departure_date')->nullable();
            $table->string('next_departure_status')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->timestamps();

            $table->index('status');
            $table->index('listing_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
