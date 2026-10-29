<?php

namespace App\Http\Controllers;

use App\Http\Requests\PedidoFilterRequest;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Http\Requests\VincularImagenProductoRequest;
use App\Http\Requests\VincularPagoRequest;
use App\Models\PedidosCatalogo;
use App\Services\PedidoService;
use App\Services\VinculacionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;
use RuntimeException;

class PedidoController extends Controller
{
    public function __construct(
        private readonly PedidoService $pedidoService,
        private readonly VinculacionService $vinculacionService,
    ) {}

    /**
     * Display the paginated order list with filters applied.
     */
    public function index(PedidoFilterRequest $request): Response
    {
        $perPage = (int) $request->input('per_page', 25);
        $filters = $request->only(['fecha', 'busqueda', 'estado', 'sucursal_id']);

        $pedidosPaginados = $this->pedidoService->getFilteredPaginatedPedidos($filters, $perPage);
        $externalData = $this->pedidoService->resolveExternalData($pedidosPaginados);

        return Inertia::render('pedidos/index', [
            'pedidos' => $pedidosPaginados,
            'productosResueltos' => $externalData['productosResueltos'],
            'sucursalesResueltas' => $externalData['sucursalesResueltas'],
            'estados' => $this->pedidoService->getEstados(),
            'filtros' => $request->only(['fecha', 'busqueda', 'estado', 'sucursal_id', 'per_page']),
        ]);
    }

    /**
     * Show a single order's full detail.
     */
    public function show(PedidosCatalogo $pedido): Response
    {
        $pedidoConDetalle = $this->pedidoService->loadPedidoDetails($pedido);
        $externalData = $this->pedidoService->resolveExternalData($pedidoConDetalle);

        return Inertia::render('pedidos/show', [
            'pedido' => $pedidoConDetalle,
            'productosResueltos' => $externalData['productosResueltos'],
            'sucursalesResueltas' => $externalData['sucursalesResueltas'],
            'estados' => $this->pedidoService->getEstados(),
        ]);
    }

    /**
     * Store a new order.
     */
    public function store(StorePedidoRequest $request): RedirectResponse
    {
        $pedido = $this->pedidoService->createPedido($request->validated());

        return to_route('pedidos.show', $pedido)->with('success', 'Pedido creado correctamente.');
    }

    /**
     * Update an existing order.
     */
    public function update(UpdatePedidoRequest $request, PedidosCatalogo $pedido): RedirectResponse
    {
        $this->pedidoService->updatePedido($pedido, $request->validated());

        return back()->with('success', 'Pedido actualizado correctamente.');
    }

    /**
     * Change only the status of an order (quick-action from the table row).
     */
    public function updateStatus(PedidosCatalogo $pedido): RedirectResponse
    {
        $newStatus = request()->string('estado_pedido')->toString();

        try {
            $this->pedidoService->updateEstado($pedido, $newStatus);
        } catch (InvalidArgumentException $e) {
            abort(422, $e->getMessage());
        }

        return back()->with('success', "Estado cambiado a '{$newStatus}'.");
    }

    /**
     * Link an order image to a product line item.
     */
    public function vincularImagenProducto(VincularImagenProductoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->vinculacionService->vincularImagenProducto(
            (int) $validated['id_pedido_producto'],
            (int) $validated['id_imagen_pedido']
        );

        return back()->with('success', 'Producto vinculado a la imagen correctamente.');
    }

    /**
     * Link a payment movement to an order image (comprobante).
     */
    public function vincularPago(VincularPagoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $this->vinculacionService->vincularPago(
                (int) $validated['id_movimiento_pago'],
                (int) $validated['id_imagen_pedido'],
                (float) $validated['monto_vinculado']
            );
        } catch (RuntimeException $e) {
            abort(404, $e->getMessage());
        }

        return back()->with('success', 'Comprobante de pago vinculado correctamente.');
    }

    /**
     * Soft-delete an order.
     */
    public function destroy(PedidosCatalogo $pedido): RedirectResponse
    {
        $this->pedidoService->deletePedido($pedido);

        return to_route('pedidos.index')->with('success', 'Pedido eliminado correctamente.');
    }
}
