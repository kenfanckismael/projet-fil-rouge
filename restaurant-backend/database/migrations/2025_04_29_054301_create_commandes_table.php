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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->foreignId('table_id')->constrained()->onDelete('cascade');
            $table->decimal('total_prix', 10, 2);
            $table->string('status')->default('en_attente'); // en_attente, en_cours, terminee, annulee
            $table->string('payment_method')->nullable(); // espece, carte, online
            $table->string('payment_status')->default('non_paye'); // paye, non_paye, partiel
            $table->string('service_type'); // sur_place, a_emporter, livraison
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
