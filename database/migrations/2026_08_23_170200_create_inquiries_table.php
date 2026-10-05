<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('source', 30);
            $table->string('status', 30);
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message')->nullable();
            $table->string('phone')->nullable();
            $table->string('nationality')->nullable();
            $table->string('preferred_date')->nullable();
            $table->string('traveler_count')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('source');
            $table->index('created_at');
            $table->index('read_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
