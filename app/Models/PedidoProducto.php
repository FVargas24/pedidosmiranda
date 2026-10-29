<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PedidoProducto extends Model
{
    use SoftDeletes;

    protected $table = 'pedido_productos';

    protected $fillable = [
        'id_pedido',
        'id_producto',
        'cantidad',
        'precio_venta',
        'sucursal_origen_id',
        'sucursal_destino_id',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'precio_venta' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<PedidosCatalogo, $this>
     */
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(PedidosCatalogo::class, 'id_pedido');
    }

    /**
     * @return HasMany<PedidoProductoImagen, $this>
     */
    public function imagenesVinculadas(): HasMany
    {
        return $this->hasMany(PedidoProductoImagen::class, 'id_pedido_producto');
    }
}
