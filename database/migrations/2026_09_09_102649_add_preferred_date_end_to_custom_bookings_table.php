<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('custom_bookings', 'preferred_date_end')) {
            return;
        }

        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->date('preferred_date_end')->nullable()->after('preferred_date');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('custom_bookings', 'preferred_date_end')) {
            return;
        }

        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->dropColumn('preferred_date_end');
        });
    }
};
