<?php

namespace App\Services;

use App\Models\PedidosCatalogo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PedidoService
{
    /**
     * Available order statuses in the catalog workflow.
     *
     * @var array<int, string>
     */
    public const ESTADOS = [
        'Pendiente',
        'En proceso',
        'Listo',
        'Enviado',
        'Completado',
        'Anulado',
    ];

    public function __construct(
        private readonly ExternalApiService $externalApiService,
    ) {}

    /**
     * Retrieve paginated orders with relationships and query filters applied.
     *
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, PedidosCatalogo>
     */
    public function getFilteredPaginatedPedidos(array $filters, int $perPage = 25): LengthAwarePaginator
    {
        return PedidosCatalogo::with([
            'cliente',
            'destino.departamento',
            'destino.provincia',
            'productos.imagenesVinculadas',
            'imagenes.imagen',
            'imagenes.pagos',
            'imagenes.productosVinculados.pedidoProducto',
            'recibos',
        ])
            ->when(! empty($filters['fecha']), fn ($q) => $q->whereDate('created_at', $filters['fecha']))
            ->when(! empty($filters['estado']), fn ($q) => $q->where('estado_pedido', $filters['estado']))
            ->when(! empty($filters['sucursal_id']), fn ($q) => $q->where('sucursal_recojo_id', $filters['sucursal_id']))
            ->when(! empty($filters['busqueda']), function ($q) use ($filters) {
                $busqueda = $filters['busqueda'];
                $q->where(function ($sub) use ($busqueda) {
                    $sub->where('id', $busqueda)
                        ->orWhereHas('cliente', fn ($c) => $c
                            ->where('nombre', 'like', "%{$busqueda}%")
                            ->orWhere('ci', 'like', "%{$busqueda}%")
                            ->orWhere('celular', 'like', "%{$busqueda}%")
                        );
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Load order details and relations for a single order.
     */
    public function loadPedidoDetails(PedidosCatalogo $pedido): PedidosCatalogo
    {
        return $pedido->load([
            'cliente',
            'destino.departamento',
            'destino.provincia',
            'productos.imagenesVinculadas',
            'imagenes.imagen',
            'imagenes.pagos',
            'imagenes.productosVinculados.pedidoProducto',
            'recibos',
        ]);
    }

    /**
     * Resolve external products and branch data for a single order or a collection/paginator of orders.
     *
     * @param  PedidosCatalogo|LengthAwarePaginator<int, PedidosCatalogo>|Collection<int, PedidosCatalogo>  $pedidos
     * @return array{productosResueltos: array<int, array{id: int, nombre: string, codigo: string, precio: float}>, sucursalesResueltas: array<int, array{id: int, nombre: string, ciudad: string, direccion: string}>}
     */
    public function resolveExternalData(PedidosCatalogo|LengthAwarePaginator|Collection $pedidos): array
    {
        $orderList = match (true) {
            $pedidos instanceof PedidosCatalogo => [$pedidos],
            $pedidos instanceof LengthAwarePaginator => $pedidos->items(),
            default => $pedidos->all(),
        };

        $productoIds = [];
        $sucursalIds = [];

        foreach ($orderList as $order) {
            foreach ($order->productos as $producto) {
                if ($producto->id_producto) {
                    $productoIds[] = (int) $producto->id_producto;
                }
                if ($producto->sucursal_origen_id) {
                    $sucursalIds[] = (int) $producto->sucursal_origen_id;
                }
                if ($producto->sucursal_destino_id) {
                    $sucursalIds[] = (int) $producto->sucursal_destino_id;
                }
            }

            if ($order->sucursal_recojo_id) {
                $sucursalIds[] = (int) $order->sucursal_recojo_id;
            }
        }

        $uniqueProductoIds = array_values(array_unique(array_filter($productoIds)));
        $uniqueSucursalIds = array_values(array_unique(array_filter($sucursalIds)));

        return [
            'productosResueltos' => $this->externalApiService->getProductos($uniqueProductoIds),
            'sucursalesResueltas' => $this->externalApiService->getSucursales($uniqueSucursalIds),
        ];
    }

    /**
     * Create a new order with optional line items wrapped in a database transaction.
     *
     * @param  array<string, mixed>  $data
     * @param  array<int, array<string, mixed>>  $productos
     */
    public function createPedido(array $data, array $productos = []): PedidosCatalogo
    {
        return DB::transaction(function () use ($data, $productos): PedidosCatalogo {
            $pedido = PedidosCatalogo::create($data);

            foreach ($productos as $item) {
                $pedido->productos()->create($item);
            }

            return $pedido;
        });
    }

    /**
     * Update order details.
     *
     * @param  array{estado_pedido?: string, detalle?: ?string, sucursal_recojo_id?: ?int}  $data
     */
    public function updatePedido(PedidosCatalogo $pedido, array $data): PedidosCatalogo
    {
        $pedido->update($data);

        return $pedido;
    }

    /**
     * Update only the status of an order after validating it against allowed catalog statuses.
     *
     * @throws InvalidArgumentException
     */
    public function updateEstado(PedidosCatalogo $pedido, string $nuevoEstado): PedidosCatalogo
    {
        if (! in_array($nuevoEstado, self::ESTADOS, true)) {
            throw new InvalidArgumentException("Estado de pedido '{$nuevoEstado}' no es válido.");
        }

        $pedido->update(['estado_pedido' => $nuevoEstado]);

        return $pedido;
    }

    /**
     * Delete an order and soft-delete its associated records.
     */
    public function deletePedido(PedidosCatalogo $pedido): bool
    {
        return (bool) $pedido->delete();
    }

    /**
     * Get available order statuses.
     *
     * @return array<int, string>
     */
    public function getEstados(): array
    {
        return self::ESTADOS;
    }
}
