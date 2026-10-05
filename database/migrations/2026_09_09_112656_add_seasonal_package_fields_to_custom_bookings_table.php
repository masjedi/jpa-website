<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->string('request_kind')->default('custom_tour')->after('status')->index();
            $table->string('package_title')->nullable()->after('request_kind');
            $table->string('package_price')->nullable()->after('package_title');
        });
    }

    public function down(): void
    {
        Schema::table('custom_bookings', function (Blueprint $table) {
            $table->dropColumn(['request_kind', 'package_title', 'package_price']);
        });
    }
};
