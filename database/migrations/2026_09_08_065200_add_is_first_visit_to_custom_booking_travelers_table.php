<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_booking_travelers', function (Blueprint $table) {
            $table->boolean('is_first_visit')->nullable()->after('country_of_residence');
        });
    }

    public function down(): void
    {
        Schema::table('custom_booking_travelers', function (Blueprint $table) {
            $table->dropColumn('is_first_visit');
        });
    }
};
