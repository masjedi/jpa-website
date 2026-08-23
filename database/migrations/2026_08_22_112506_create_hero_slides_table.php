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
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hero_section_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('subtitle');
            $table->string('status', 20);
            $table->unsignedInteger('sort_order');
            $table->timestamps();

            $table->index(['hero_section_id', 'status']);
            $table->index(['hero_section_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
