<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Imagen extends Model
{
    use SoftDeletes;

    protected $table = 'imagenes';

    protected $fillable = [
        'url',
    ];

    /**
     * @return HasMany<ImagenPedidos, $this>
     */
    public function pedidos(): HasMany
    {
        return $this->hasMany(ImagenPedidos::class, 'id_imagen');
    }
}
