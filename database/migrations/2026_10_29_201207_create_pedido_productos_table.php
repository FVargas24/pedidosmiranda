<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedido_productos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_pedido');
            $table->integer('id_producto');
            $table->integer('cantidad');
            $table->decimal('precio_venta', 10, 2);
            $table->unsignedBigInteger('sucursal_origen_id');
            $table->unsignedBigInteger('sucursal_destino_id');
            $table->string('estado');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_pedido')
                ->references('id')
                ->on('pedidos_catalogo')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_productos');
    }
};