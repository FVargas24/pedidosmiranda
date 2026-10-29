<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedido_notas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_pedido');
            $table->unsignedBigInteger('id_user');
            $table->integer('cantidad');

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
        Schema::dropIfExists('pedido_notas');
    }
};