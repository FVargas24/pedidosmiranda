<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePedidoRequest extends FormRequest
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
            'estado_pedido' => ['required', 'string', 'max:100'],
            'detalle' => ['nullable', 'string'],
            'sucursal_recojo_id' => ['nullable', 'integer'],
        ];
    }
}
