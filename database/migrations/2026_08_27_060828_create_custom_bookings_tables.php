<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 32)->unique();
            $table->string('status', 40);
            $table->unsignedTinyInteger('adults');
            $table->unsignedTinyInteger('children');
            $table->unsignedTinyInteger('traveler_count');
            $table->string('group_type', 40)->nullable();
            $table->date('start_date')->nullable();
            $table->string('flexibility', 40);
            $table->string('season', 80)->nullable();
            $table->unsignedTinyInteger('duration_days');
            $table->string('other_destination', 120)->nullable();
            $table->boolean('recommend_destinations')->default(false);
            $table->string('route_preference', 40);
            $table->string('visa_status', 40);
            $table->string('insurance_status', 40);
            $table->text('emergency_name');
            $table->text('emergency_relationship');
            $table->text('emergency_phone');
            $table->string('dietary', 40);
            $table->text('dietary_details')->nullable();
            $table->string('medical', 40);
            $table->text('medical_details')->nullable();
            $table->string('contact_method', 40);
            $table->text('special_requests')->nullable();
            $table->boolean('accuracy');
            $table->boolean('terms');
            $table->boolean('privacy');
            $table->boolean('marketing')->default(false);
            $table->boolean('wants_complete')->default(false);
            $table->boolean('wants_guide')->default(false);
            $table->boolean('wants_transportation')->default(false);
            $table->boolean('wants_accommodation')->default(false);
            $table->boolean('wants_airport')->default(false);
            $table->boolean('wants_domestic')->default(false);
            $table->string('guide_language', 40)->nullable();
            $table->string('guide_language_other', 80)->nullable();
            $table->text('guide_request')->nullable();
            $table->string('vehicle', 40)->nullable();
            $table->string('transport_coverage', 40)->nullable();
            $table->text('transport_notes')->nullable();
            $table->string('accommodation_level', 40)->nullable();
            $table->string('room_preference', 40)->nullable();
            $table->unsignedTinyInteger('room_count')->nullable();
            $table->text('accommodation_notes')->nullable();
            $table->string('arrival_assistance', 40)->nullable();
            $table->boolean('arrival_details_later')->default(false);
            $table->string('arrival_airport', 80)->nullable();
            $table->date('arrival_date')->nullable();
            $table->string('arrival_time', 20)->nullable();
            $table->text('arrival_flight')->nullable();
            $table->string('departure_assistance', 40)->nullable();
            $table->boolean('departure_details_later')->default(false);
            $table->string('departure_airport', 80)->nullable();
            $table->date('departure_date')->nullable();
            $table->string('departure_time', 20)->nullable();
            $table->text('departure_flight')->nullable();
            $table->string('domestic_preference', 40)->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('start_date');
            $table->index('created_at');
        });

        Schema::create('custom_booking_travelers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_booking_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('sort_order');
            $table->boolean('is_primary')->default(false);
            $table->string('first_name', 80);
            $table->string('last_name', 80);
            $table->date('date_of_birth');
            $table->string('nationality', 80);
            $table->string('email')->nullable();
            $table->string('phone', 60)->nullable();
            $table->string('country_of_residence', 80)->nullable();
            $table->timestamps();

            $table->index(['custom_booking_id', 'is_primary']);
            $table->index('email');
        });

        Schema::create('custom_booking_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('custom_booking_traveler_id')->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('sort_order');
            $table->string('issuing_country', 80);
            $table->date('expiry_date');
            $table->timestamps();
        });

        Schema::create('custom_booking_destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destination_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 120);
            $table->timestamps();

            $table->unique(['custom_booking_id', 'name']);
        });

        Schema::create('custom_booking_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_booking_id')->constrained()->cascadeOnDelete();
            $table->string('interest', 40);
            $table->timestamps();

            $table->unique(['custom_booking_id', 'interest']);
        });

        Schema::create('custom_booking_status_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_booking_id')->constrained()->cascadeOnDelete();
            $table->string('from_status', 40)->nullable();
            $table->string('to_status', 40);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['custom_booking_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_booking_status_changes');
        Schema::dropIfExists('custom_booking_interests');
        Schema::dropIfExists('custom_booking_destinations');
        Schema::dropIfExists('custom_booking_documents');
        Schema::dropIfExists('custom_booking_travelers');
        Schema::dropIfExists('custom_bookings');
    }
};
