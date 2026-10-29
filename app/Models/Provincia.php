<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provincia extends Model
{
    use SoftDeletes;

    protected $table = 'provincias';

    protected $fillable = [
        'nombre_prov',
    ];

    public function destinos(): HasMany
    {
        return $this->hasMany(Destino::class, 'id_provincia');
    }
}