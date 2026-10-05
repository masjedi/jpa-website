<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('custom_booking_attachments');
        Schema::dropIfExists('custom_booking_status_changes');
        Schema::dropIfExists('custom_booking_interests');
        Schema::dropIfExists('custom_booking_destinations');
        Schema::dropIfExists('custom_booking_documents');
        Schema::dropIfExists('custom_booking_travelers');
        Schema::dropIfExists('custom_bookings');

        Schema::create('custom_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('status')->default('submitted')->index();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('passport_number');
            $table->string('country');
            $table->string('tour_type');
            $table->unsignedSmallInteger('number_of_tourists');
            $table->json('tourist_genders');
            $table->string('guide_preference');
            $table->date('preferred_date')->nullable();
            $table->date('preferred_date_end')->nullable();
            $table->date('alternative_date')->nullable();
            $table->text('preferred_destinations');
            $table->text('other_requests')->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index('preferred_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_bookings');
    }
};
