<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('verification_token', 64)->nullable()->unique()->after('notes');
            $table->timestamp('verification_expires_at')->nullable()->after('verification_token');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['verification_token', 'verification_expires_at']);
        });
    }
};
