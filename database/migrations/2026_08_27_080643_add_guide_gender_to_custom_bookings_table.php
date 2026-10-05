<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->string('guide_gender', 20)->nullable()->after('wants_guide');
        });
    }

    public function down(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->dropColumn('guide_gender');
        });
    }
};
