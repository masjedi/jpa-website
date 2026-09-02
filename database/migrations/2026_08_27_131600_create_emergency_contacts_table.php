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
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained()->restrictOnDelete();
            $table->string('full_name', 120);
            $table->string('position', 120);
            $table->string('organization', 160);
            $table->string('emergency_type', 40);
            $table->string('primary_phone', 60);
            $table->string('secondary_phone', 60)->nullable();
            $table->string('whatsapp', 60)->nullable();
            $table->string('availability_notes', 500)->nullable();
            $table->date('last_verified_at');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_customer_shareable')->default(false);
            $table->boolean('is_active')->default(true);
            $table->text('internal_notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('emergency_type');
            $table->index('is_active');
            $table->index('is_customer_shareable');
            $table->index('last_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_contacts');
    }
};
