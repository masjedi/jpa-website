<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('team_member_id')
                ->nullable()
                ->after('reading_time_minutes')
                ->constrained('team_members')
                ->nullOnDelete();

            $table->index('team_member_id');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_member_id');
        });
    }
};
