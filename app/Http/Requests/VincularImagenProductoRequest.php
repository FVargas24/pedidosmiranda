<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VincularImagenProductoRequest extends FormRequest
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
            'id_pedido_producto' => ['required', 'integer', 'exists:pedido_productos,id'],
            'id_imagen_pedido' => ['required', 'integer', 'exists:imagen_pedidos,id'],
        ];
    }
}
