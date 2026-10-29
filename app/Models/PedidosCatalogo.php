<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PedidosCatalogo extends Model
{
    use SoftDeletes;

    protected $table = 'pedidos_catalogo';

    protected $fillable = [
        'id_cliente',
        'id_destino',
        'estado_pedido',
        'detalle',
        'sucursal_recojo_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id_cliente' => 'integer',
            'id_destino' => 'integer',
            'sucursal_recojo_id' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Cliente, $this>
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    /**
     * @return BelongsTo<Destino, $this>
     */
    public function destino(): BelongsTo
    {
        return $this->belongsTo(Destino::class, 'id_destino');
    }

    /**
     * @return HasMany<PedidoProducto, $this>
     */
    public function productos(): HasMany
    {
        return $this->hasMany(PedidoProducto::class, 'id_pedido');
    }

    /**
     * @return HasMany<ImagenPedidos, $this>
     */
    public function imagenes(): HasMany
    {
        return $this->hasMany(ImagenPedidos::class, 'id_pedido');
    }

    /**
     * @return HasMany<PedidoNota, $this>
     */
    public function recibos(): HasMany
    {
        return $this->hasMany(PedidoNota::class, 'id_pedido');
    }
}
