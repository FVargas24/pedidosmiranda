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
            $mock = $this->loadJsonData('productos.json');
            $fallback = isset($mock[$id]) ? [
                'id' => (int) $mock[$id]['id'],
                'nombre' => (string) $mock[$id]['nombre'],
                'codigo' => (string) $mock[$id]['codigo'],
                'precio' => (float) $mock[$id]['precio'],
            ] : $this->makeStubProducto($id);

            return $this->fetchOrFallback(
                "{$this->baseUrls['products']}/productos/{$id}",
                $fallback
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
            $mock = $this->loadJsonData('movimientos_pago.json');
            $fallback = isset($mock[$id]) ? [
                'id' => (int) $mock[$id]['id'],
                'monto' => (float) $mock[$id]['monto'],
                'fecha' => (string) $mock[$id]['fecha'],
                'descripcion' => (string) $mock[$id]['descripcion'],
            ] : $this->makeStubMovimiento($id);

            return $this->fetchOrFallback(
                "{$this->baseUrls['payments']}/movimientos/{$id}",
                $fallback
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
            $mock = $this->loadJsonData('sucursales.json');
            $fallback = isset($mock[$id]) ? [
                'id' => (int) $mock[$id]['id'],
                'nombre' => (string) $mock[$id]['nombre'],
                'ciudad' => (string) $mock[$id]['ciudad'],
                'direccion' => (string) $mock[$id]['direccion'],
            ] : $this->makeStubSucursal($id);

            return $this->fetchOrFallback(
                "{$this->baseUrls['sucursales']}/sucursales/{$id}",
                $fallback
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
     * @template T of array<string, mixed>
     *
     * @param  T|null  $fallback
     * @return T|null
     */
    private function fetchOrFallback(string $url, ?array $fallback): ?array
    {
        try {
            $response = Http::timeout(3)->get($url);

            if ($response->successful()) {
                /** @var T $json */
                $json = $response->json();

                return $json;
            }
        } catch (\Throwable $e) {
            Log::warning("ExternalApiService: failed to reach {$url}", ['error' => $e->getMessage()]);
        }

        // Return the stub while the real service is unavailable
        return $fallback;
    }

    /**
     * Get all available local mock products.
     *
     * @return array<int, array{id: int, nombre: string, codigo: string, precio: float}>
     */
    public function getMockProductos(): array
    {
        /** @var array<int, array{id: int, nombre: string, codigo: string, precio: float}> $data */
        $data = $this->loadJsonData('productos.json');

        return $data;
    }

    /**
     * Get all available local mock branches.
     *
     * @return array<int, array{id: int, nombre: string, ciudad: string, direccion: string}>
     */
    public function getMockSucursales(): array
    {
        /** @var array<int, array{id: int, nombre: string, ciudad: string, direccion: string}> $data */
        $data = $this->loadJsonData('sucursales.json');

        return $data;
    }

    /**
     * Get all available local mock payment movements.
     *
     * @return array<int, array{id: int, monto: float, fecha: string, descripcion: string}>
     */
    public function getMockMovimientosPago(): array
    {
        /** @var array<int, array{id: int, monto: float, fecha: string, descripcion: string}> $data */
        $data = $this->loadJsonData('movimientos_pago.json');

        return $data;
    }

    /** @return array{id: int, nombre: string, codigo: string, precio: float} */
    private function makeStubProducto(int $id): array
    {
        $mock = $this->loadJsonData('productos.json');

        if (isset($mock[$id])) {
            return [
                'id' => (int) $mock[$id]['id'],
                'nombre' => (string) $mock[$id]['nombre'],
                'codigo' => (string) $mock[$id]['codigo'],
                'precio' => (float) $mock[$id]['precio'],
            ];
        }

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
        $mock = $this->loadJsonData('movimientos_pago.json');

        if (isset($mock[$id])) {
            return [
                'id' => (int) $mock[$id]['id'],
                'monto' => (float) $mock[$id]['monto'],
                'fecha' => (string) $mock[$id]['fecha'],
                'descripcion' => (string) $mock[$id]['descripcion'],
            ];
        }

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
        $mock = $this->loadJsonData('sucursales.json');

        if (isset($mock[$id])) {
            return [
                'id' => (int) $mock[$id]['id'],
                'nombre' => (string) $mock[$id]['nombre'],
                'ciudad' => (string) $mock[$id]['ciudad'],
                'direccion' => (string) $mock[$id]['direccion'],
            ];
        }

        return [
            'id' => $id,
            'nombre' => "Sucursal #{$id}",
            'ciudad' => 'Sin ciudad',
            'direccion' => '',
        ];
    }

    /**
     * Load JSON mock file indexed by record ID.
     *
     * @return array<int, array<string, mixed>>
     */
    private function loadJsonData(string $filename): array
    {
        $filePath = database_path("data/{$filename}");

        if (! file_exists($filePath)) {
            return [];
        }

        $raw = file_get_contents($filePath);
        if ($raw === false) {
            return [];
        }

        /** @var array<int, array<string, mixed>> $list */
        $list = json_decode($raw, true) ?? [];

        $indexed = [];
        foreach ($list as $item) {
            if (isset($item['id'])) {
                $indexed[(int) $item['id']] = $item;
            }
        }

        return $indexed;
    }
}
