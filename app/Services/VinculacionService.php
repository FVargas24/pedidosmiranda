<?php

namespace App\Services;

use App\Models\ImagenPedidos;
use App\Models\PedidoPagos;
use App\Models\PedidoProductoImagen;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use RuntimeException;

class VinculacionService
{
    public function __construct(
        private readonly ExternalApiService $externalApiService,
    ) {}

    /**
     * Link an order image to a specific product line item without creating duplicate links.
     */
    public function vincularImagenProducto(int $pedidoProductoId, int $imagenPedidoId): PedidoProductoImagen
    {
        return PedidoProductoImagen::firstOrCreate([
            'id_pedido_producto' => $pedidoProductoId,
            'id_imagen_pedido' => $imagenPedidoId,
        ]);
    }

    /**
     * Link an external payment movement to an order image (comprobante) after verifying its validity.
     *
     * @throws RuntimeException
     * @throws ModelNotFoundException
     */
    public function vincularPago(int $movimientoPagoId, int $imagenPedidoId, float $montoVinculado): PedidoPagos
    {
        $movimiento = $this->externalApiService->getMovimientoPago($movimientoPagoId);

        if ($movimiento === null) {
            throw new RuntimeException("El movimiento de pago ID {$movimientoPagoId} no existe en el servicio externo.");
        }

        $imagenPedido = ImagenPedidos::findOrFail($imagenPedidoId);

        return PedidoPagos::create([
            'id_movimiento_pago' => $movimientoPagoId,
            'id_imagen_pedido' => $imagenPedido->id,
            'monto_vinculado' => $montoVinculado,
        ]);
    }

    /**
     * Unlink a product line item from an image.
     */
    public function desvincularImagenProducto(int $pedidoProductoId, int $imagenPedidoId): bool
    {
        return (bool) PedidoProductoImagen::where('id_pedido_producto', $pedidoProductoId)
            ->where('id_imagen_pedido', $imagenPedidoId)
            ->delete();
    }
}
