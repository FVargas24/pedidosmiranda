<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Imagen extends Model
{
    use SoftDeletes;

    protected $table = 'imagenes';

    protected $fillable = [
        'url',
    ];

    public function pedidos(): HasMany
    {
        return $this->hasMany(ImagenPedidos::class, 'id_imagen');
    }
}