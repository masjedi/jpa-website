<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->string('status', 20);
            $table->string('client_name');
            $table->string('client_email');
            $table->text('client_address')->nullable();
            $table->string('tour_reference')->nullable();
            $table->date('issued_on');
            $table->date('due_on')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->decimal('amount', 12, 2);
            $table->longText('services_html');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('issued_on');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
