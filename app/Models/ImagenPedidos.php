<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ImagenPedidos extends Model
{
    use SoftDeletes;

    protected $table = 'imagen_pedidos';

    protected $fillable = [
        'id_pedido',
        'id_imagen',
        'tipo',
        'cantidad',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
        ];
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(PedidosCatalogo::class, 'id_pedido');
    }

    public function imagen(): BelongsTo
    {
        return $this->belongsTo(Imagen::class, 'id_imagen');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(PedidoPagos::class, 'id_imagen_pedido');
    }

    public function productosVinculados(): HasMany
    {
        return $this->hasMany(PedidoProductoImagen::class, 'id_imagen_pedido');
    }
}