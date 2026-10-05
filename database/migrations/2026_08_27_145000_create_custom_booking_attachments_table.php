<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_booking_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_booking_id')->constrained()->cascadeOnDelete();
            $table->string('original_name', 160);
            $table->string('mime_type', 120)->nullable();
            $table->unsignedInteger('size_bytes')->default(0);
            $table->json('media');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('custom_booking_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_booking_attachments');
    }
};
