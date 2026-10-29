<?php

namespace App\Services;

use App\Models\Cliente;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ClienteService
{
    /**
     * Get paginated clients with optional search filter.
     *
     * @return LengthAwarePaginator<int, Cliente>
     */
    public function getPaginatedClientes(?string $busqueda = null, int $perPage = 15): LengthAwarePaginator
    {
        return Cliente::query()
            ->when(! empty($busqueda), function ($query) use ($busqueda) {
                $query->where(function ($sub) use ($busqueda) {
                    $sub->where('nombre', 'like', "%{$busqueda}%")
                        ->orWhere('ci', 'like', "%{$busqueda}%")
                        ->orWhere('celular', 'like', "%{$busqueda}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Search clients by search query string for autocomplete / selects.
     *
     * @return Collection<int, Cliente>
     */
    public function buscarClientes(string $termino, int $limit = 10): Collection
    {
        return Cliente::query()
            ->where('nombre', 'like', "%{$termino}%")
            ->orWhere('ci', 'like', "%{$termino}%")
            ->orWhere('celular', 'like', "%{$termino}%")
            ->limit($limit)
            ->get();
    }

    /**
     * Find an existing client by identity card (CI) or create a new one.
     *
     * @param  array{nombre: string, ci: string, celular: string, google_id?: ?string, google_email?: ?string, avatar?: ?string}  $attributes
     */
    public function findOrCreateCliente(array $attributes): Cliente
    {
        return Cliente::firstOrCreate(
            ['ci' => $attributes['ci']],
            $attributes
        );
    }

    /**
     * Update client information.
     *
     * @param  array{nombre?: string, ci?: string, celular?: string, google_id?: ?string, google_email?: ?string, avatar?: ?string}  $data
     */
    public function updateCliente(Cliente $cliente, array $data): Cliente
    {
        $cliente->update($data);

        return $cliente;
    }
}
