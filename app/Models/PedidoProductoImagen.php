<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoProductoImagen extends Model
{
    use SoftDeletes;

    protected $table = 'pedido_producto_imagen';

    protected $fillable = [
        'id_pedido_producto',
        'id_imagen_pedido',
    ];

    public function pedidoProducto(): BelongsTo
    {
        return $this->belongsTo(PedidoProducto::class, 'id_pedido_producto');
    }

    public function imagenPedido(): BelongsTo
    {
        return $this->belongsTo(ImagenPedidos::class, 'id_imagen_pedido');
    }
}