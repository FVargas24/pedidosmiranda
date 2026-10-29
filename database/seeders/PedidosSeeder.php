<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\Destino;
use App\Models\Imagen;
use App\Models\ImagenPedidos;
use App\Models\PedidoNota;
use App\Models\PedidoProducto;
use App\Models\PedidoProductoImagen;
use App\Models\PedidosCatalogo;
use App\Models\Provincia;
use Illuminate\Database\Seeder;

class PedidosSeeder extends Seeder
{
    /** Bolivia departments with some provinces each. */
    private const DEPARTAMENTOS = [
        'La Paz' => ['Murillo', 'Nor Yungas', 'Sud Yungas', 'Omasuyos'],
        'Cochabamba' => ['Cercado', 'Chapare', 'Quillacollo', 'Ayopaya'],
        'Santa Cruz' => ['Andrés Ibáñez', 'Warnes', 'Chiquitos', 'Ñuflo de Chávez'],
        'Oruro' => ['Cercado', 'Sajama', 'Carangas'],
        'Potosí' => ['Tomás Frías', 'Charcas', 'Sud Chichas'],
        'Chuquisaca' => ['Oropeza', 'Yamparáez', 'Zudáñez'],
        'Tarija' => ['Cercado', 'Gran Chaco', 'Avilés'],
        'Beni' => ['Trinidad', 'Marbán', 'Vaca Díez'],
        'Pando' => ['Nicolás Suárez', 'Manuripi'],
    ];

    private const ESTADOS_PEDIDO = ['Pendiente', 'En proceso', 'Listo', 'Enviado', 'Completado', 'Anulado'];

    private const TIPOS_IMAGEN = ['pago', 'producto'];

    private const ESTADOS_IMAGEN = ['pendiente', 'verificado', 'rechazado'];

    private const ESTADOS_PRODUCTO = ['reservado', 'disponible', 'enviado'];

    public function run(): void
    {
        // ── 1. Departamentos y Provincias ────────────────────────────────
        $destinos = [];

        foreach (self::DEPARTAMENTOS as $depNombre => $provincias) {
            $departamento = Departamento::create(['nombre_dep' => $depNombre]);

            foreach ($provincias as $provNombre) {
                $provincia = Provincia::create(['nombre_prov' => $provNombre]);

                $destinos[] = Destino::create([
                    'id_departamento' => $departamento->id,
                    'id_provincia' => $provincia->id,
                    'estado' => 'activo',
                    'tipo_destino' => fake()->randomElement(['ciudad', 'rural', 'zona franca']),
                ]);
            }
        }

        // ── 2. Clientes ──────────────────────────────────────────────────
        $clientes = [];
        $nombresBolivianos = [
            'María Eugenia Quispe Mamani',
            'Carlos Alberto Condori Huanca',
            'Rosa Elena Chura Flores',
            'Juan Pablo Mamani Ticona',
            'Lucía Fernanda Apaza López',
            'Pedro Ramiro Salinas Vargas',
            'Ana Gabriela Rojas Torrez',
            'Fernando Miguel Calle Gutierrez',
            'Elena Beatriz Limachi Poma',
            'Roberto Andrés Soria Arce',
            'Silvia Paola Mendoza Choque',
            'Diego Alejandro Quispe Ramos',
            'Patricia Sandra Huanca Cruz',
            'Oscar Raúl Flores Cárdenas',
            'Claudia Marcela Vela Coca',
            'Iván Rodrigo Morales Jiménez',
            'Valeria Xiomara Tarqui Nina',
            'Mauricio Sebastián Loza Ticona',
            'Daniela Estefanía Cortez Pinto',
            'Gabriel Ernesto Aguirre Soliz',
        ];

        foreach ($nombresBolivianos as $nombre) {
            $clientes[] = Cliente::create([
                'nombre' => $nombre,
                'ci' => (string) fake()->numberBetween(1000000, 9999999),
                'celular' => '7'.fake()->numberBetween(1000000, 9999999),
                'avatar' => null,
            ]);
        }

        // ── 3. Imágenes base ─────────────────────────────────────────────
        $imagenesBase = [];
        for ($i = 1; $i <= 30; $i++) {
            $imagenesBase[] = Imagen::create([
                'url' => "https://picsum.photos/seed/pedido{$i}/400/300",
            ]);
        }

        // ── 4. Pedidos (20 registros) ────────────────────────────────────
        for ($i = 0; $i < 20; $i++) {
            $cliente = fake()->randomElement($clientes);
            $destino = fake()->randomElement($destinos);
            $estadoPedido = fake()->randomElement(self::ESTADOS_PEDIDO);

            /** @var PedidosCatalogo $pedido */
            $pedido = PedidosCatalogo::create([
                'id_cliente' => $cliente->id,
                'id_destino' => $destino->id,
                'estado_pedido' => $estadoPedido,
                'detalle' => fake()->optional(0.7)->sentence(8),
                'sucursal_recojo_id' => fake()->optional(0.5)->numberBetween(1, 5),
            ]);

            // ── 4a. Productos del pedido (1–3 por pedido) ─────────────
            $cantidadProductos = fake()->numberBetween(1, 3);
            $productosCreados = [];

            for ($p = 0; $p < $cantidadProductos; $p++) {
                $productosCreados[] = PedidoProducto::create([
                    'id_pedido' => $pedido->id,
                    'id_producto' => fake()->numberBetween(1, 50),
                    'cantidad' => fake()->numberBetween(1, 5),
                    'precio_venta' => fake()->randomFloat(2, 20, 500),
                    'sucursal_origen_id' => fake()->numberBetween(1, 5),
                    'sucursal_destino_id' => fake()->numberBetween(1, 5),
                    'estado' => fake()->randomElement(self::ESTADOS_PRODUCTO),
                ]);
            }

            // ── 4b. Imágenes del pedido (1–3 por pedido) ──────────────
            $cantidadImagenes = fake()->numberBetween(1, 3);

            for ($img = 0; $img < $cantidadImagenes; $img++) {
                $imagenBase = fake()->randomElement($imagenesBase);
                $tipo = fake()->randomElement(self::TIPOS_IMAGEN);

                /** @var ImagenPedidos $imagenPedido */
                $imagenPedido = ImagenPedidos::create([
                    'id_pedido' => $pedido->id,
                    'id_imagen' => $imagenBase->id,
                    'tipo' => $tipo,
                    'cantidad' => fake()->numberBetween(1, 4),
                    'estado' => fake()->randomElement(self::ESTADOS_IMAGEN),
                ]);

                // Vincular un producto a la imagen si el tipo es 'producto'
                if ($tipo === 'producto' && count($productosCreados) > 0) {
                    $productoVincular = fake()->randomElement($productosCreados);
                    PedidoProductoImagen::create([
                        'id_pedido_producto' => $productoVincular->id,
                        'id_imagen_pedido' => $imagenPedido->id,
                    ]);
                }
            }

            // ── 4c. Nota del pedido (50% de probabilidad) ─────────────
            if (fake()->boolean(50)) {
                PedidoNota::create([
                    'id_pedido' => $pedido->id,
                    'id_user' => 1, // Usuario admin por defecto
                    'cantidad' => fake()->numberBetween(1, 3),
                ]);
            }
        }

        $this->command->info('✅ PedidosSeeder: 20 pedidos creados con clientes, destinos, productos e imágenes.');
    }
}
