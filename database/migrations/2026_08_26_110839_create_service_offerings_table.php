<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_offerings', function (Blueprint $table) {
            $table->id();
            $table->string('status', 20);
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('tagline');
            $table->text('description');
            $table->string('category', 40);
            $table->string('icon_key', 40);
            $table->json('features');
            $table->boolean('is_featured')->default(false);
            $table->boolean('show_on_home')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('status');
            $table->index('category');
            $table->index('sort_order');
            $table->index('is_featured');
            $table->index('show_on_home');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_offerings');
    }
};
