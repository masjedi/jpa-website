<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->json('dietary_options')->nullable()->after('dietary');
        });
    }

    public function down(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->dropColumn('dietary_options');
        });
    }
};
