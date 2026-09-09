<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->date('preferred_date')->nullable()->change();
            $table->date('preferred_date_end')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->date('preferred_date')->nullable(false)->change();
            $table->date('preferred_date_end')->nullable(false)->change();
        });
    }
};
