<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'id_cliente' => ['required', 'integer', 'exists:clientes,id'],
            'id_destino' => ['required', 'integer', 'exists:destinos,id'],
            'estado_pedido' => ['required', 'string', 'max:100'],
            'detalle' => ['nullable', 'string'],
            'sucursal_recojo_id' => ['nullable', 'integer'],
        ];
    }
}
