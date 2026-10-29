<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provincia extends Model
{
    use SoftDeletes;

    protected $table = 'provincias';

    protected $fillable = [
        'nombre_prov',
    ];

    /**
     * @return HasMany<Destino, $this>
     */
    public function destinos(): HasMany
    {
        return $this->hasMany(Destino::class, 'id_provincia');
    }
}
