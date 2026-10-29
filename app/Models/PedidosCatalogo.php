<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function destino(): BelongsTo
    {
        return $this->belongsTo(Destino::class, 'id_destino');
    }

    public function productos(): HasMany
    {
        return $this->hasMany(PedidoProducto::class, 'id_pedido');
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(ImagenPedidos::class, 'id_pedido');
    }

    public function recibos(): HasMany
    {
        return $this->hasMany(PedidoNota::class, 'id_pedido');
    }
}