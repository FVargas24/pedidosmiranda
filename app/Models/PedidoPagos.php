<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PedidoPagos extends Model
{
    use SoftDeletes;

    protected $table = 'pedido_pagos';

    protected $fillable = [
        'id_movimiento_pago',
        'id_imagen_pedido',
        'monto_vinculado',
    ];

    protected function casts(): array
    {
        return [
            'monto_vinculado' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<ImagenPedidos, $this>
     */
    public function imagenPedido(): BelongsTo
    {
        return $this->belongsTo(ImagenPedidos::class, 'id_imagen_pedido');
    }
}
