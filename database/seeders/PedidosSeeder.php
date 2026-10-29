<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\Destino;
use App\Models\Imagen;
use App\Models\ImagenPedidos;
use App\Models\PedidoNota;
use App\Models\PedidoPagos;
use App\Models\PedidoProducto;
use App\Models\PedidoProductoImagen;
use App\Models\PedidosCatalogo;
use App\Models\Provincia;
use App\Models\User;
use App\Services\ExternalApiService;
use Illuminate\Database\Seeder;

class PedidosSeeder extends Seeder
{
    /** Bolivia departments with key provinces. */
    private const DEPARTAMENTOS = [
        'La Paz' => ['Murillo', 'Sud Yungas', 'Nor Yungas', 'Omasuyos', 'Ingavi', 'Los Andes'],
        'Santa Cruz' => ['Andrés Ibáñez', 'Warnes', 'Obispo Santistevan', 'Chiquitos', 'Ñuflo de Chávez'],
        'Cochabamba' => ['Cercado', 'Quillacollo', 'Chapare', 'Punata', 'Esteban Arce'],
        'Oruro' => ['Cercado', 'Sajama', 'Pantaleón Dalence', 'Eduardo Avaroa'],
        'Potosí' => ['Tomás Frías', 'Cornelio Saavedra', 'Sud Chichas', 'Modesto Omiste'],
        'Chuquisaca' => ['Oropeza', 'Zudáñez', 'Yamparáez', 'Tomina'],
        'Tarija' => ['Cercado', 'Gran Chaco', 'Avilés', 'Aniceto Arce'],
        'Beni' => ['Cercado', 'Vaca Díez', 'José Ballivián', 'Marbán'],
        'Pando' => ['Nicolás Suárez', 'Manuripi', 'Madre de Dios'],
    ];

    private const ESTADOS_PEDIDO = [
        'Pendiente',
        'En proceso',
        'Listo',
        'Enviado',
        'Completado',
        'Anulado',
    ];

    private const TIPOS_DESTINO = [
        'Entrega a Domicilio',
        'Sucursal Comercial',
        'Agencia Central',
        'Terminal de Buses',
        'Punto de Recojo',
    ];

    private const ESTADOS_PRODUCTO = [
        'preparado',
        'reservado',
        'en_transito',
        'entregado',
    ];

    private const DETALLES_PEDIDOS = [
        'Entregar en horario de oficina antes de las 13:00 en recepción.',
        'Cliente recogerá personalmente en sucursal. Llamar 15 minutos antes de la entrega.',
        'Facturar a nombre de Distribuidora San Martín con NIT 1029384019.',
        'Empaquetar con plástico burbuja adicional para viaje interprovincial en flota.',
        'Anticipo pagado vía QR bancario, cancelará el saldo restante contra entrega.',
        'Entregar en puerta principal, timbre 3B (preguntar por Sra. Carmen).',
        'Pedido corporativo urgente para taller de capacitación docente.',
        'Dejar en portería del edificio si el cliente no responde el celular.',
        'Cuadernos personalizados con logotipo empresarial grabado en tapa.',
        'Cliente habitual con crédito aprobado a 15 días.',
        'Enviar con mensajero motorizado a la zona sur.',
        'Incluir recibo oficial y nota de remisión original en el paquete.',
        'Entregar en el almacén central ubicado en la zona industrial.',
        'Requiere verificación de stock antes de despachar el segundo lote.',
    ];

    private const NOMBRES_CLIENTES = [
        ['Carlos Alberto', 'Choque', 'Mamani'],
        ['María Eugenia', 'Quispe', 'Flores'],
        ['Alejandro Marcelo', 'Condori', 'Huanca'],
        ['Rosa Elena', 'Mendoza', 'Chura'],
        ['Juan Pablo', 'Mamani', 'Ticona'],
        ['Lucía Fernanda', 'Apaza', 'López'],
        ['Pedro Ramiro', 'Salinas', 'Vargas'],
        ['Ana Gabriela', 'Rojas', 'Torrez'],
        ['Fernando Miguel', 'Calle', 'Gutierrez'],
        ['Elena Beatriz', 'Limachi', 'Poma'],
        ['Roberto Andrés', 'Soria', 'Arce'],
        ['Silvia Paola', 'Mendoza', 'Choque'],
        ['Diego Alejandro', 'Quispe', 'Ramos'],
        ['Patricia Sandra', 'Huanca', 'Cruz'],
        ['Oscar Raúl', 'Flores', 'Cárdenas'],
        ['Claudia Marcela', 'Vela', 'Coca'],
        ['Iván Rodrigo', 'Morales', 'Jiménez'],
        ['Valeria Xiomara', 'Tarqui', 'Nina'],
        ['Mauricio Sebastián', 'Loza', 'Ticona'],
        ['Daniela Estefanía', 'Cortez', 'Pinto'],
        ['Gabriel Ernesto', 'Aguirre', 'Soliz'],
        ['Roxana Milenca', 'Aruquipa', 'Guzmán'],
        ['Javier Antonio', 'Illanes', 'Castillo'],
        ['Carla Jimena', 'Montaño', 'Peñaranda'],
        ['Víctor Hugo', 'Navarro', 'Benítez'],
    ];

    private const IMAGENES_MOCK = [
        // Comprobantes de pago
        ['url' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80', 'tipo' => 'pago'],
        ['url' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'tipo' => 'pago'],
        ['url' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=80', 'tipo' => 'pago'],
        ['url' => 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&auto=format&fit=crop&q=80', 'tipo' => 'pago'],
        ['url' => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'tipo' => 'pago'],
        ['url' => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80', 'tipo' => 'pago'],
        // Fotos de cuadernos y productos
        ['url' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
        ['url' => 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80', 'tipo' => 'producto'],
    ];

    public function run(): void
    {
        $apiService = app(ExternalApiService::class);

        // Cargar datos estáticos externos de los archivos JSON
        $mockProductos = $apiService->getMockProductos();
        $mockSucursales = $apiService->getMockSucursales();
        $mockMovimientos = $apiService->getMockMovimientosPago();

        $productoIds = array_keys($mockProductos);
        $sucursalIds = array_keys($mockSucursales);
        $movimientoIds = array_keys($mockMovimientos);

        // Fallback seguro si los JSON estuviesen vacíos
        if (empty($productoIds)) {
            $productoIds = range(1, 20);
        }
        if (empty($sucursalIds)) {
            $sucursalIds = range(1, 8);
        }
        if (empty($movimientoIds)) {
            $movimientoIds = range(1001, 1015);
        }

        // Obtener usuario operador para auditoría/notas
        $usuarioOperador = User::first() ?? User::factory()->create([
            'name' => 'Operador Ventas Miranda',
            'email' => 'ventas@pedidosmiranda.com',
        ]);

        // ── 1. Departamentos, Provincias y Destinos ─────────────────────────
        $destinosCreados = [];

        foreach (self::DEPARTAMENTOS as $nombreDep => $provincias) {
            $departamento = Departamento::firstOrCreate(['nombre_dep' => $nombreDep]);

            foreach ($provincias as $nombreProv) {
                $provincia = Provincia::firstOrCreate(['nombre_prov' => $nombreProv]);

                $destinosCreados[] = Destino::firstOrCreate([
                    'id_departamento' => $departamento->id,
                    'id_provincia' => $provincia->id,
                ], [
                    'estado' => 'activo',
                    'tipo_destino' => fake()->randomElement(self::TIPOS_DESTINO),
                ]);
            }
        }

        // ── 2. Clientes Bolivianos ──────────────────────────────────────────
        $clientesCreados = [];
        $departamentoSiglas = ['LP', 'SC', 'CB', 'OR', 'PT', 'CH', 'TJ', 'BN', 'PD'];

        foreach (self::NOMBRES_CLIENTES as $indice => [$nombres, $paterno, $materno]) {
            $nombreCompleto = "{$nombres} {$paterno} {$materno}";
            $sigla = $departamentoSiglas[$indice % count($departamentoSiglas)];
            $ciNumero = (string) fake()->unique()->numberBetween(3000000, 9999999);
            $ciConExtension = "{$ciNumero}-{$sigla}";
            $celular = '7'.fake()->numberBetween(1000000, 9999999);
            $slugEmail = strtolower("{$nombres}.{$paterno}").($indice + 1).'@gmail.com';
            $transliterated = iconv('UTF-8', 'ASCII//TRANSLIT', $slugEmail);
            $slugEmail = preg_replace('/\s+/', '', is_string($transliterated) ? $transliterated : $slugEmail) ?? $slugEmail;

            $clientesCreados[] = Cliente::create([
                'nombre' => $nombreCompleto,
                'ci' => $ciConExtension,
                'celular' => $celular,
                'google_email' => $slugEmail,
                'google_id' => 'goog_'.fake()->unique()->numerify('##########'),
                'avatar' => 'https://api.dicebear.com/7.x/initials/svg?seed='.urlencode($nombreCompleto).'&backgroundColor=6d28d9,7c3aed',
            ]);
        }

        // ── 3. Catálogo de Imágenes del Sistema ─────────────────────────────
        $imagenesProducto = [];
        $imagenesPago = [];

        foreach (self::IMAGENES_MOCK as $item) {
            $img = Imagen::create(['url' => $item['url']]);
            if ($item['tipo'] === 'producto') {
                $imagenesProducto[] = $img;
            } else {
                $imagenesPago[] = $img;
            }
        }

        // ── 4. Generación de Pedidos con Datos Completos en Español ────────
        $totalPedidos = 25;
        $movimientoIndex = 0;

        for ($i = 1; $i <= $totalPedidos; $i++) {
            /** @var Cliente $cliente */
            $cliente = fake()->randomElement($clientesCreados);
            /** @var Destino $destino */
            $destino = fake()->randomElement($destinosCreados);
            $estadoPedido = fake()->randomElement(self::ESTADOS_PEDIDO);
            $detalle = fake()->randomElement(self::DETALLES_PEDIDOS);

            // Si el estado es "Listo" o "Completado", suele tener sucursal de recojo asignada
            $sucursalRecojo = (in_array($estadoPedido, ['Listo', 'Completado', 'En proceso']) || fake()->boolean(40))
                ? fake()->randomElement($sucursalIds)
                : null;

            /** @var PedidosCatalogo $pedido */
            $pedido = PedidosCatalogo::create([
                'id_cliente' => $cliente->id,
                'id_destino' => $destino->id,
                'estado_pedido' => $estadoPedido,
                'detalle' => $detalle,
                'sucursal_recojo_id' => $sucursalRecojo,
                'created_at' => now()->subDays(fake()->numberBetween(0, 30))->subHours(fake()->numberBetween(1, 23)),
            ]);

            // ── 4a. Ítems del Pedido (1 a 4 productos del catálogo JSON) ──
            $cantidadItems = fake()->numberBetween(1, 4);
            $productosPedido = [];
            $totalMontoPedido = 0.0;

            for ($p = 0; $p < $cantidadItems; $p++) {
                $idProducto = fake()->randomElement($productoIds);
                $infoProducto = $mockProductos[$idProducto] ?? null;

                $precioBase = $infoProducto ? (float) $infoProducto['precio'] : fake()->randomFloat(2, 20, 150);
                $cantidad = fake()->numberBetween(1, 6);
                $subtotal = round($precioBase * $cantidad, 2);
                $totalMontoPedido += $subtotal;

                $sucursalOrigen = fake()->randomElement($sucursalIds);
                $sucursalDestino = fake()->randomElement($sucursalIds);

                $productosPedido[] = PedidoProducto::create([
                    'id_pedido' => $pedido->id,
                    'id_producto' => $idProducto,
                    'cantidad' => $cantidad,
                    'precio_venta' => $precioBase,
                    'sucursal_origen_id' => $sucursalOrigen,
                    'sucursal_destino_id' => $sucursalDestino,
                    'estado' => fake()->randomElement(self::ESTADOS_PRODUCTO),
                ]);
            }

            // ── 4b. Imágenes de Producto vinculadas ─────────────────────────
            if ($productosPedido !== []) {
                $imgBase = fake()->randomElement($imagenesProducto);

                $imagenPedidoProd = ImagenPedidos::create([
                    'id_pedido' => $pedido->id,
                    'id_imagen' => $imgBase->id,
                    'tipo' => 'producto',
                    'cantidad' => fake()->numberBetween(1, 3),
                    'estado' => 'verificado',
                ]);

                // Asociar al primer producto del pedido
                PedidoProductoImagen::create([
                    'id_pedido_producto' => $productosPedido[0]->id,
                    'id_imagen_pedido' => $imagenPedidoProd->id,
                ]);
            }

            // ── 4c. Comprobantes de Pago e Historial Bancario (tipo 'pago') ──
            // Solo pedidos no anulados pueden tener comprobantes de pago
            if ($estadoPedido !== 'Anulado') {
                $imgPagoBase = fake()->randomElement($imagenesPago);
                $estadoPagoImg = ($estadoPedido === 'Completado' || $estadoPedido === 'Enviado') ? 'verificado' : 'pendiente';

                $imagenPedidoPago = ImagenPedidos::create([
                    'id_pedido' => $pedido->id,
                    'id_imagen' => $imgPagoBase->id,
                    'tipo' => 'pago',
                    'cantidad' => 1,
                    'estado' => $estadoPagoImg,
                ]);

                // Asignar un ID de movimiento de pago estático del JSON de pagos
                $idMovimiento = $movimientoIds[$movimientoIndex % count($movimientoIds)];
                $movimientoIndex++;

                $movimientoData = $mockMovimientos[$idMovimiento] ?? null;
                $montoPago = $movimientoData
                    ? (float) $movimientoData['monto']
                    : round($totalMontoPedido * fake()->randomElement([0.5, 1.0]), 2);

                PedidoPagos::create([
                    'id_movimiento_pago' => $idMovimiento,
                    'id_imagen_pedido' => $imagenPedidoPago->id,
                    'monto_vinculado' => $montoPago,
                ]);
            }

            // ── 4d. Notas de Usuario y Recibos emitidos ────────────────────
            if (fake()->boolean(65)) {
                PedidoNota::create([
                    'id_pedido' => $pedido->id,
                    'id_user' => $usuarioOperador->id,
                    'cantidad' => fake()->numberBetween(1, 2),
                ]);
            }
        }

        $this->command->info('✅ Seeder completado exitosamente:');
        $this->command->info('   • 9 Departamentos y Provincias de Bolivia con destinos activos.');
        $this->command->info('   • 25 Clientes registrados con datos bolivianos (CI, celular, email).');
        $this->command->info("   • {$totalPedidos} Pedidos con estados, detalles, sucursales y notas.");
        $this->command->info("   • Productos vinculados a 'database/data/productos.json'.");
        $this->command->info("   • Sucursales vinculadas a 'database/data/sucursales.json'.");
        $this->command->info("   • Comprobantes y Pagos vinculados a 'database/data/movimientos_pago.json'.");
    }
}
