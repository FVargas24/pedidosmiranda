
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_departamento');
            $table->unsignedBigInteger('id_provincia');
            $table->string('estado');
            $table->string('tipo_destino');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_departamento')
                ->references('id')
                ->on('departamentos')
                ->restrictOnDelete();

            $table->foreign('id_provincia')
                ->references('id')
                ->on('provincias')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinos');
    }
};
