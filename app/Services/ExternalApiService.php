<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service layer for resolving external resource IDs that do not have
 * a local database table (products, payment movements, branches/sucursales).
 *
 * Replace the base URLs and auth logic with your real microservice endpoints.
 * Each method caches its response to avoid repeated network calls per request.
 */
class ExternalApiService
{
    /** @var array<string, string> */
    private array $baseUrls;

    private int $cacheTtlSeconds = 300; // 5 minutes

    public function __construct()
    {
        $this->baseUrls = [
            'products' => config('services.external_api.products_url', 'http://localhost:8001/api'),
            'payments' => config('services.external_api.payments_url', 'http://localhost:8002/api'),
            'sucursales' => config('services.external_api.sucursales_url', 'http://localhost:8003/api'),
        ];
    }

    /**
     * Resolve a single product by its external ID.
     *
     * @return array{id: int, nombre: string, codigo: string, precio: float}|null
     */
    public function getProducto(int $id): ?array
    {
        return Cache::remember("ext_producto_{$id}", $this->cacheTtlSeconds, function () use ($id) {
            return $this->fetchOrFallback(
                "{$this->baseUrls['products']}/productos/{$id}",
                $this->makeStubProducto($id)
            );
        });
    }

    /**
     * Resolve multiple products at once keyed by their IDs.
     *
     * @param  int[]  $ids
     * @return array<int, array{id: int, nombre: string, codigo: string, precio: float}>
     */
    public function getProductos(array $ids): array
    {
        $results = [];
        foreach (array_unique($ids) as $id) {
            $product = $this->getProducto($id);
            if ($product !== null) {
                $results[$id] = $product;
            }
        }

        return $results;
    }

    /**
     * Resolve a payment movement by its external ID.
     *
     * @return array{id: int, monto: float, fecha: string, descripcion: string}|null
     */
    public function getMovimientoPago(int $id): ?array
    {
        return Cache::remember("ext_movimiento_{$id}", $this->cacheTtlSeconds, function () use ($id) {
            return $this->fetchOrFallback(
                "{$this->baseUrls['payments']}/movimientos/{$id}",
                $this->makeStubMovimiento($id)
            );
        });
    }

    /**
     * Resolve a branch (sucursal) by its external ID.
     *
     * @return array{id: int, nombre: string, ciudad: string, direccion: string}|null
     */
    public function getSucursal(int $id): ?array
    {
        return Cache::remember("ext_sucursal_{$id}", $this->cacheTtlSeconds, function () use ($id) {
            return $this->fetchOrFallback(
                "{$this->baseUrls['sucursales']}/sucursales/{$id}",
                $this->makeStubSucursal($id)
            );
        });
    }

    /**
     * Resolve multiple branches at once keyed by their IDs.
     *
     * @param  int[]  $ids
     * @return array<int, array{id: int, nombre: string, ciudad: string, direccion: string}>
     */
    public function getSucursales(array $ids): array
    {
        $results = [];
        foreach (array_unique(array_filter($ids)) as $id) {
            $sucursal = $this->getSucursal($id);
            if ($sucursal !== null) {
                $results[$id] = $sucursal;
            }
        }

        return $results;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Attempt a GET request; on any failure return the $fallback stub so
     * the UI never breaks when the external service is unavailable.
     *
     * @param  array<string, mixed>  $fallback
     * @return array<string, mixed>|null
     */
    private function fetchOrFallback(string $url, array $fallback): ?array
    {
        try {
            $response = Http::timeout(3)->get($url);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Throwable $e) {
            Log::warning("ExternalApiService: failed to reach {$url}", ['error' => $e->getMessage()]);
        }

        // Return the stub while the real service is unavailable
        return $fallback;
    }

    /** @return array{id: int, nombre: string, codigo: string, precio: float} */
    private function makeStubProducto(int $id): array
    {
        return [
            'id' => $id,
            'nombre' => "Producto #{$id}",
            'codigo' => "COD-{$id}",
            'precio' => 0.0,
        ];
    }

    /** @return array{id: int, monto: float, fecha: string, descripcion: string} */
    private function makeStubMovimiento(int $id): array
    {
        return [
            'id' => $id,
            'monto' => 0.0,
            'fecha' => now()->toDateString(),
            'descripcion' => "Movimiento #{$id}",
        ];
    }

    /** @return array{id: int, nombre: string, ciudad: string, direccion: string} */
    private function makeStubSucursal(int $id): array
    {
        return [
            'id' => $id,
            'nombre' => "Sucursal #{$id}",
            'ciudad' => 'Sin ciudad',
            'direccion' => '',
        ];
    }
}

