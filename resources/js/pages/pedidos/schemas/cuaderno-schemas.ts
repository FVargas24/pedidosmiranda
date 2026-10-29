import { z } from 'zod';

export const agregarProductoSchema = z.object({
    cuaderno_id: z.number().int().positive('ID de cuaderno requerido'),
    imagen_id: z.number().optional().nullable(),
    producto_id: z.number().int().positive('Debe seleccionar un producto válido'),
    cantidad: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
    precio_venta: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
});

export type AgregarProductoFormData = z.infer<typeof agregarProductoSchema>;

export const vincularPagoSchema = z.object({
    cuaderno_id: z.number().int().positive('ID de cuaderno requerido'),
    imagen_id: z.number().int().positive('ID de imagen de comprobante requerido'),
    movimiento_ids: z.array(z.number().int()).min(1, 'Debe seleccionar al menos un movimiento de pago'),
});

export type VincularPagoFormData = z.infer<typeof vincularPagoSchema>;

export const filtroDepartamentosSchema = z.object({
    departamentos: z.array(z.string()),
});

export type FiltroDepartamentosData = z.infer<typeof filtroDepartamentosSchema>;

export const whatsappMensajeSchema = z.object({
    telefono: z.string().min(8, 'Número de celular no válido'),
    tipo_mensaje: z.enum(['listo', 'falta', 'nohay']),
    mensaje: z.string().min(1, 'El mensaje no puede estar vacío'),
    pedido_id: z.number().int().positive(),
});

export type WhatsAppMensajeData = z.infer<typeof whatsappMensajeSchema>;

