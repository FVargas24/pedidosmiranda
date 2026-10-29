<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Departamento extends Model
{
    use SoftDeletes;

    protected $table = 'departamentos';

    protected $fillable = [
        'nombre_dep',
    ];

    /**
     * @return HasMany<Destino, $this>
     */
    public function destinos(): HasMany
    {
        return $this->hasMany(Destino::class, 'id_departamento');
    }
}
