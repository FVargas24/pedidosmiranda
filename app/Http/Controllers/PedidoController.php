<?php

namespace App\Http\Controllers;

use App\Http\Requests\PedidoFilterRequest;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Http\Requests\VincularImagenProductoRequest;
use App\Http\Requests\VincularPagoRequest;
use App\Models\ImagenPedidos;
use App\Models\PedidoPagos;
use App\Models\PedidoProductoImagen;
use App\Models\PedidosCatalogo;
use App\Services\ExternalApiService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PedidoController extends Controller
{
    /** Available order statuses shown in filters and badges. */
    private const ESTADOS = [
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
     * Display the paginated order list with filters applied.
     */
    public function index(PedidoFilterRequest $request): Response
    {
        $perPage = (int) $request->input('per_page', 25);

        $query = PedidosCatalogo::with([
            'cliente',
            'destino.departamento',
            'destino.provincia',
            'productos.imagenesVinculadas',
            'imagenes.imagen',
            'imagenes.pagos',
            'imagenes.productosVinculados.pedidoProducto',
            'recibos',
        ])
            ->when($request->filled('fecha'), fn ($q) => $q->whereDate('created_at', $request->input('fecha')))
            ->when($request->filled('estado'), fn ($q) => $q->where('estado_pedido', $request->input('estado')))
            ->when($request->filled('sucursal_id'), fn ($q) => $q->where('sucursal_recojo_id', $request->input('sucursal_id')))
            ->when($request->filled('busqueda'), function ($q) use ($request) {
                $busqueda = $request->input('busqueda');
                $q->where(function ($sub) use ($busqueda) {
                    $sub->where('id', $busqueda)
                        ->orWhereHas('cliente', fn ($c) => $c
                            ->where('nombre', 'like', "%{$busqueda}%")
                            ->orWhere('ci', 'like', "%{$busqueda}%")
                            ->orWhere('celular', 'like', "%{$busqueda}%")
                        );
                });
            })
            ->latest();

        $pedidosPaginados = $query->paginate($perPage)->withQueryString();

        // ─── Resolve external IDs ─────────────────────────────────────────
        $productoIds = [];
        $sucursalIds = [];

        foreach ($pedidosPaginados->items() as $pedido) {
            foreach ($pedido->productos as $producto) {
                $productoIds[] = $producto->id_producto;
                $sucursalIds[] = $producto->sucursal_origen_id;
                $sucursalIds[] = $producto->sucursal_destino_id;
            }

            if ($pedido->sucursal_recojo_id) {
                $sucursalIds[] = $pedido->sucursal_recojo_id;
            }
        }

        $productosResueltos = $this->externalApiService->getProductos(array_filter(array_unique($productoIds)));
        $sucursalesResueltas = $this->externalApiService->getSucursales(array_filter(array_unique($sucursalIds)));

        return Inertia::render('pedidos/index', [
            'pedidos' => $pedidosPaginados,
            'productosResueltos' => $productosResueltos,
            'sucursalesResueltas' => $sucursalesResueltas,
            'estados' => self::ESTADOS,
            'filtros' => $request->only(['fecha', 'busqueda', 'estado', 'sucursal_id', 'per_page']),
        ]);
    }

    /**
     * Show a single order's full detail.
     */
    public function show(PedidosCatalogo $pedido): Response
    {
        $pedido->load([
            'cliente',
            'destino.departamento',
            'destino.provincia',
            'productos.imagenesVinculadas',
            'imagenes.imagen',
            'imagenes.pagos',
            'imagenes.productosVinculados.pedidoProducto',
            'recibos',
        ]);

        $productoIds = $pedido->productos->pluck('id_producto')->filter()->unique()->values()->all();
        $sucursalIds = $pedido->productos
            ->flatMap(fn ($p) => [$p->sucursal_origen_id, $p->sucursal_destino_id])
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($pedido->sucursal_recojo_id) {
            $sucursalIds[] = $pedido->sucursal_recojo_id;
        }

        return Inertia::render('pedidos/show', [
            'pedido' => $pedido,
            'productosResueltos' => $this->externalApiService->getProductos($productoIds),
            'sucursalesResueltas' => $this->externalApiService->getSucursales($sucursalIds),
            'estados' => self::ESTADOS,
        ]);
    }

    /**
     * Store a new order.
     */
    public function store(StorePedidoRequest $request): RedirectResponse
    {
        $pedido = PedidosCatalogo::create($request->validated());

        return to_route('pedidos.show', $pedido)->with('success', 'Pedido creado correctamente.');
    }

    /**
     * Update a field on an existing order (typically the status).
     */
    public function update(UpdatePedidoRequest $request, PedidosCatalogo $pedido): RedirectResponse
    {
        $pedido->update($request->validated());

        return back()->with('success', 'Pedido actualizado correctamente.');
    }

    /**
     * Change only the status of an order (quick-action from the table row).
     */
    public function updateStatus(PedidosCatalogo $pedido): RedirectResponse
    {
        $newStatus = request()->string('estado_pedido')->toString();

        abort_unless(in_array($newStatus, self::ESTADOS, true), 422, 'Estado no válido.');

        $pedido->update(['estado_pedido' => $newStatus]);

        return back()->with('success', "Estado cambiado a '{$newStatus}'.");
    }

    /**
     * Link an order image to a product line item.
     */
    public function vincularImagenProducto(VincularImagenProductoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $alreadyLinked = PedidoProductoImagen::where('id_pedido_producto', $validated['id_pedido_producto'])
            ->where('id_imagen_pedido', $validated['id_imagen_pedido'])
            ->exists();

        if (! $alreadyLinked) {
            PedidoProductoImagen::create($validated);
        }

        return back()->with('success', 'Producto vinculado a la imagen correctamente.');
    }

    /**
     * Link a payment movement to an order image (comprobante).
     */
    public function vincularPago(VincularPagoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Validate the payment movement exists in the external service
        $movimiento = $this->externalApiService->getMovimientoPago($validated['id_movimiento_pago']);

        abort_if($movimiento === null, 404, 'Movimiento de pago no encontrado.');

        // Verify the imagen_pedido belongs to a valid pedido
        $imagenPedido = ImagenPedidos::findOrFail($validated['id_imagen_pedido']);

        PedidoPagos::create([
            'id_movimiento_pago' => $validated['id_movimiento_pago'],
            'id_imagen_pedido' => $imagenPedido->id,
            'monto_vinculado' => $validated['monto_vinculado'],
        ]);

        return back()->with('success', 'Comprobante de pago vinculado correctamente.');
    }

    /**
     * Soft-delete an order.
     */
    public function destroy(PedidosCatalogo $pedido): RedirectResponse
    {
        $pedido->delete();

        return to_route('pedidos.index')->with('success', 'Pedido eliminado correctamente.');
    }
}
