<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    /**
     * @return BelongsTo<PedidosCatalogo, $this>
     */
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(PedidosCatalogo::class, 'id_pedido');
    }

    /**
     * @return BelongsTo<Imagen, $this>
     */
    public function imagen(): BelongsTo
    {
        return $this->belongsTo(Imagen::class, 'id_imagen');
    }

    /**
     * @return HasMany<PedidoPagos, $this>
     */
    public function pagos(): HasMany
    {
        return $this->hasMany(PedidoPagos::class, 'id_imagen_pedido');
    }

    /**
     * @return HasMany<PedidoProductoImagen, $this>
     */
    public function productosVinculados(): HasMany
    {
        return $this->hasMany(PedidoProductoImagen::class, 'id_imagen_pedido');
    }
}
