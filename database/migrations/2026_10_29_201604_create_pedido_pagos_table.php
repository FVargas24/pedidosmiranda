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
        Schema::create('pedido_pagos', function (Blueprint $table) {
            $table->id();
            $table->integer('id_movimiento_pago');
            $table->unsignedBigInteger('id_imagen_pedido');
            $table->decimal('monto_vinculado', 10, 2);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_pagos');
    }
};
