<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->json('line_items')->nullable()->after('amount');
            $table->decimal('discount_percent', 5, 2)->default(0)->after('line_items');
            $table->longText('services_html')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['line_items', 'discount_percent']);
        });
    }
};
