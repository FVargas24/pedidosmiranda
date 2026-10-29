<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoNota extends Model
{
    //
    use SoftDeletes;

    protected $table = 'pedido_notas';

    protected $fillable = [
        'id_pedido',
        'id_user',
        'cantidad',
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
}
