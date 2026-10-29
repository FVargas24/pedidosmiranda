<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PedidoProductoImagen extends Model
{
    use SoftDeletes;

    protected $table = 'pedido_producto_imagen';

    protected $fillable = [
        'id_pedido_producto',
        'id_imagen_pedido',
    ];

    /**
     * @return BelongsTo<PedidoProducto, $this>
     */
    public function pedidoProducto(): BelongsTo
    {
        return $this->belongsTo(PedidoProducto::class, 'id_pedido_producto');
    }

    /**
     * @return BelongsTo<ImagenPedidos, $this>
     */
    public function imagenPedido(): BelongsTo
    {
        return $this->belongsTo(ImagenPedidos::class, 'id_imagen_pedido');
    }
}
