<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contrato_id')->constrained('contratos')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->dateTime('payment_date')->nullable();
            $table->dateTime('due_date');
            $table->string('status')->default('pendente');
            $table->decimal('credit_used', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
    }
};