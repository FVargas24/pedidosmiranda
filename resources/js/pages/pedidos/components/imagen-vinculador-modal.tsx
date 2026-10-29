import { Form } from '@inertiajs/react';
import { useState } from 'react';
import type { ExternalProducto, ImagenPedido, PedidoCatalogo, PedidoProducto } from '@/types/pedidos';

interface ImagenVinculadorModalProps {
    isOpen: boolean;
    onClose: () => void;
    imagenPedido: ImagenPedido;
    pedido: PedidoCatalogo;
    productosResueltos: Record<number, ExternalProducto>;
    mode: 'producto' | 'pago';
}

export default function ImagenVinculadorModal({
    isOpen,
    onClose,
    imagenPedido,
    pedido,
    productosResueltos,
    mode,
}: ImagenVinculadorModalProps) {
    const [selectedProductoId, setSelectedProductoId] = useState<number | ''>('');
    const [movimientoPagoId, setMovimientoPagoId] = useState('');
    const [monto, setMonto] = useState('');

    if (!isOpen) {
        return null;
    }

    const productosDisponibles: PedidoProducto[] = pedido.productos;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between rounded-t-xl bg-purple-700 px-5 py-4 text-white">
                    <h2 className="text-lg font-semibold">
                        {mode === 'producto' ? '🔗 Vincular Producto a Imagen' : '💳 Vincular Comprobante de Pago'}
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 p-5">
                    {/* Imagen info */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                        <p className="font-medium text-gray-700">Imagen ID: #{imagenPedido.id}</p>
                        <p className="text-gray-500">Tipo: {imagenPedido.tipo}</p>
                        {imagenPedido.imagen?.url && (
                            <img
                                src={imagenPedido.imagen.url}
                                alt="Imagen del pedido"
                                className="mt-2 h-20 w-full rounded object-cover"
                            />
                        )}
                    </div>

                    {/* ── Producto mode ── */}
                    {mode === 'producto' && (
                        <Form
                            action={route('pedidos.vincularImagenProducto')}
                            method="post"
                            resetOnSuccess
                            onSuccess={onClose}
                        >
                            {({ errors, processing }) => (
                                <div className="space-y-3">
                                    <input type="hidden" name="id_imagen_pedido" value={imagenPedido.id} />

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Seleccionar Producto del Pedido
                                        </label>
                                        <select
                                            name="id_pedido_producto"
                                            value={selectedProductoId}
                                            onChange={(e) => setSelectedProductoId(Number(e.target.value))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                                            required
                                        >
                                            <option value="">-- Seleccionar producto --</option>
                                            {productosDisponibles.map((pp) => {
                                                const extProducto = productosResueltos[pp.id_producto];
                                                return (
                                                    <option key={pp.id} value={pp.id}>
                                                        {extProducto?.nombre ?? `Producto #${pp.id_producto}`} — Cant:{' '}
                                                        {pp.cantidad}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        {errors.id_pedido_producto && (
                                            <p className="mt-1 text-xs text-red-500">{errors.id_pedido_producto}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                                        >
                                            {processing ? 'Vinculando…' : 'Vincular Producto'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}

                    {/* ── Pago mode ── */}
                    {mode === 'pago' && (
                        <Form
                            action={route('pedidos.vincularPago')}
                            method="post"
                            resetOnSuccess
                            onSuccess={onClose}
                        >
                            {({ errors, processing }) => (
                                <div className="space-y-3">
                                    <input type="hidden" name="id_imagen_pedido" value={imagenPedido.id} />

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            ID Movimiento de Pago (externo)
                                        </label>
                                        <input
                                            type="number"
                                            name="id_movimiento_pago"
                                            value={movimientoPagoId}
                                            onChange={(e) => setMovimientoPagoId(e.target.value)}
                                            placeholder="Ej: 1042"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                            required
                                        />
                                        {errors.id_movimiento_pago && (
                                            <p className="mt-1 text-xs text-red-500">{errors.id_movimiento_pago}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Monto Vinculado (Bs.)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="monto_vinculado"
                                            value={monto}
                                            onChange={(e) => setMonto(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                            required
                                        />
                                        {errors.monto_vinculado && (
                                            <p className="mt-1 text-xs text-red-500">{errors.monto_vinculado}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {processing ? 'Vinculando…' : 'Vincular Pago'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}

