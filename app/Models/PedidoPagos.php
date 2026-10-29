<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function imagenPedido(): BelongsTo
    {
        return $this->belongsTo(ImagenPedidos::class, 'id_imagen_pedido');
    }
}