<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos_catalogo', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_destino');

            $table->string('estado_pedido');
            $table->text('detalle')->nullable();
            $table->unsignedBigInteger('sucursal_recojo_id')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_cliente')
                ->references('id')
                ->on('clientes')
                ->restrictOnDelete();

            $table->foreign('id_destino')
                ->references('id')
                ->on('destinos')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos_catalogo');
    }
};