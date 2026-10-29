<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedido_producto_imagen', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_pedido_producto');
            $table->unsignedBigInteger('id_imagen_pedido');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_pedido_producto')
                ->references('id')
                ->on('pedido_productos')
                ->cascadeOnDelete();

            $table->foreign('id_imagen_pedido')
                ->references('id')
                ->on('imagen_pedidos')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_producto_imagen');
    }
};