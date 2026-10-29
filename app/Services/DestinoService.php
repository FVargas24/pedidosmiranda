<?php

namespace App\Services;

use App\Models\Departamento;
use App\Models\Destino;
use Illuminate\Database\Eloquent\Collection;

class DestinoService
{
    /**
     * Get all active shipping destinations eager-loading department and province.
     *
     * @return Collection<int, Destino>
     */
    public function getDestinosActivos(): Collection
    {
        return Destino::with(['departamento', 'provincia'])
            ->where('estado', 'activo')
            ->get();
    }

    /**
     * Get all departments with their respective provinces.
     *
     * @return Collection<int, Departamento>
     */
    public function getDepartamentosConProvincias(): Collection
    {
        return Departamento::with(['destinos.provincia'])
            ->orderBy('nombre_dep')
            ->get();
    }

    /**
     * Find a destination by ID.
     */
    public function findDestino(int $id): ?Destino
    {
        return Destino::with(['departamento', 'provincia'])->find($id);
    }
}
