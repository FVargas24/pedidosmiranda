<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Destino extends Model
{
    use SoftDeletes;

    protected $table = 'destinos';

    protected $fillable = [
        'id_departamento',
        'id_provincia',
        'estado',
        'tipo_destino',
    ];

    /**
     * @return BelongsTo<Departamento, $this>
     */
    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'id_departamento');
    }

    /**
     * @return BelongsTo<Provincia, $this>
     */
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class, 'id_provincia');
    }

    /**
     * @return HasMany<PedidosCatalogo, $this>
     */
    public function pedidos(): HasMany
    {
        return $this->hasMany(PedidosCatalogo::class, 'id_destino');
    }
}
