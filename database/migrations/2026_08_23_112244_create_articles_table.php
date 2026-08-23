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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('status', 20);
            $table->string('title');
            $table->string('summary');
            $table->string('category', 40);
            $table->json('cover_media')->nullable();
            $table->longText('content');
            $table->unsignedSmallInteger('reading_time_minutes')->default(1);
            $table->string('author_name');
            $table->string('author_role');
            $table->string('author_avatar')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->json('related_tour_slugs')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('category');
            $table->index('is_featured');
            $table->index('published_at');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
