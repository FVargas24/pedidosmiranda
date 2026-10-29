<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departamento extends Model
{
    use SoftDeletes;

    protected $table = 'departamentos';

    protected $fillable = [
        'nombre_dep',
    ];

    public function destinos(): HasMany
    {
        return $this->hasMany(Destino::class, 'id_departamento');
    }
}