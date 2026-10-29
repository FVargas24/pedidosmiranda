<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VincularPagoRequest extends FormRequest
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
            'id_movimiento_pago' => ['required', 'integer'],
            'id_imagen_pedido' => ['required', 'integer', 'exists:imagen_pedidos,id'],
            'monto_vinculado' => ['required', 'numeric', 'min:0'],
        ];
    }
}
