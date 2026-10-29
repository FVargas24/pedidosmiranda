<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imagen_pedidos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_pedido');
            $table->unsignedBigInteger('id_imagen');

            $table->string('tipo');
            $table->integer('cantidad');
            $table->string('estado');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_pedido')
                ->references('id')
                ->on('pedidos_catalogo')
                ->cascadeOnDelete();

            $table->foreign('id_imagen')
                ->references('id')
                ->on('imagenes')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imagen_pedidos');
    }
};