<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->unsignedTinyInteger('guide_count')->nullable()->after('wants_guide');
            $table->json('guide_languages')->nullable()->after('guide_language');
        });
    }

    public function down(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->dropColumn(['guide_count', 'guide_languages']);
        });
    }
};
