<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(PedidosCatalogo::class, 'id_pedido');
    }

    public function imagenesVinculadas(): HasMany
    {
        return $this->hasMany(PedidoProductoImagen::class, 'id_pedido_producto');
    }
}