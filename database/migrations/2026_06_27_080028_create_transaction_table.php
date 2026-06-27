<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
   {
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();

        $table->foreignId('team_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('customer_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->foreignId('cashier_id')
            ->constrained('users')
            ->restrictOnDelete();
        
        $table->string('invoice_number')->unique();

        $table->decimal('subtotal', 10, 2);

        $table->decimal('tax', 10, 2)->default(0);

        $table->decimal('discount', 10, 2)->default(0);

        $table->decimal('total', 10, 2);

        $table->enum('payment_method', [
            'cash',
            'zaad',
            'evc',
            'jeeb',
            'card'
            ]);
    
        $table->timestamps();
    });
}

   public function down(): void
   {
    Schema::dropIfExists('transactions');
   }
};


