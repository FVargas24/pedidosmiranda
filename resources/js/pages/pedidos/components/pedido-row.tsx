import { router } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle,
    ClipboardList,
    PackageCheck,
    Pencil,
    Plus,
    ShieldX,
    ShoppingCart,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { ExternalProducto, ExternalSucursal, ImagenPedido, PedidoCatalogo } from '@/types/pedidos';
import ImagenVinculadorModal from './imagen-vinculador-modal';

interface PedidoRowProps {
    pedido: PedidoCatalogo;
    productosResueltos: Record<number, ExternalProducto>;
    sucursalesResueltas: Record<number, ExternalSucursal>;
    estados: string[];
}

const ESTADO_COLORS: Record<string, string> = {
    Pendiente: 'bg-red-500',
    'En proceso': 'bg-yellow-500',
    Listo: 'bg-green-500',
    Enviado: 'bg-blue-500',
    Completado: 'bg-purple-600',
    Anulado: 'bg-gray-500',
};

const QUICK_ESTADOS = ['LA PAZ', 'ENVIADO', 'P. LISTO', 'P. PENDIENTE'] as const;

export default function PedidoRow({ pedido, productosResueltos, sucursalesResueltas, estados }: PedidoRowProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImagen, setSelectedImagen] = useState<ImagenPedido | null>(null);
    const [modalMode, setModalMode] = useState<'producto' | 'pago'>('producto');

    const cliente = pedido.cliente;
    const destino = pedido.destino;
    const tienaNota = pedido.recibos.length > 0;

    const badgeColor = ESTADO_COLORS[pedido.estado_pedido] ?? 'bg-gray-400';

    const handleOpenModal = (imagen: ImagenPedido, mode: 'producto' | 'pago') => {
        setSelectedImagen(imagen);
        setModalMode(mode);
        setModalOpen(true);
    };

    const handleEliminar = () => {
        if (!window.confirm(`¿Eliminar pedido #${pedido.id}?`)) return;
        router.delete(route('pedidos.destroy', pedido.id));
    };

    const handleCompletar = () => {
        router.patch(route('pedidos.updateStatus', pedido.id), { estado_pedido: 'Completado' });
    };

    const handleAnular = () => {
        if (!window.confirm('¿Anular este pedido?')) return;
        router.patch(route('pedidos.updateStatus', pedido.id), { estado_pedido: 'Anulado' });
    };

    return (
        <>
            <tr className="border-b border-gray-200 bg-white hover:bg-gray-50/60">
                {/* ── # ID ────────────────────────────────────────────── */}
                <td className="border-r border-gray-200 px-2 py-3 text-center text-sm font-semibold text-gray-700">
                    {pedido.id}
                </td>

                {/* ── Quick-status checkboxes ─────────────────────────── */}
                {QUICK_ESTADOS.map((label) => (
                    <td
                        key={label}
                        className="border-r border-gray-200 px-1 py-3 text-center"
                        title={label}
                    >
                        <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-purple-600"
                            defaultChecked={pedido.estado_pedido === label}
                            onChange={() => {
                                router.patch(route('pedidos.updateStatus', pedido.id), {
                                    estado_pedido: label,
                                });
                            }}
                        />
                    </td>
                ))}

                {/* ── Información Personal ────────────────────────────── */}
                <td className="border-r border-gray-200 px-3 py-3">
                    {cliente ? (
                        <div className="min-w-[170px] space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                                ℹ Información Personal
                            </p>
                            <p className="text-sm font-bold text-gray-800 uppercase leading-tight">
                                {cliente.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                                🪪 CI: <span className="font-medium text-gray-700">{cliente.ci}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                📞 Cel: <span className="font-medium text-gray-700">{cliente.celular}</span>
                            </p>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">Sin cliente</span>
                    )}
                </td>

                {/* ── Depto / Prov ─────────────────────────────────────── */}
                <td className="border-r border-gray-200 px-3 py-3 text-sm">
                    {destino ? (
                        <div className="min-w-[110px] space-y-1">
                            <p className="font-semibold text-gray-700">
                                {destino.departamento?.nombre ?? '—'}
                            </p>
                            <p className="text-xs text-gray-500">{destino.provincia?.nombre ?? '—'}</p>
                            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                                📦 Detalles
                            </p>
                            <p className="text-xs text-gray-400">{pedido.detalle ?? 'S/D'}</p>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">Sin destino</span>
                    )}
                </td>

                {/* ── Imágenes / Vinculaciones ─────────────────────────── */}
                <td className="border-r border-gray-200 px-3 py-3">
                    <div className="min-w-[320px] space-y-2">
                        {pedido.imagenes.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Sin imágenes registradas</p>
                        ) : (
                            pedido.imagenes.map((imagenPedido) => {
                                const isPago = imagenPedido.tipo === 'pago';
                                return (
                                    <div
                                        key={imagenPedido.id}
                                        className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 space-y-1.5"
                                    >
                                        {/* Add guide button */}
                                        <button className="flex w-full items-center justify-center gap-1 rounded border border-dashed border-green-400 px-2 py-1 text-xs text-green-600 hover:bg-green-50">
                                            <Plus className="h-3 w-3" />
                                            Añadir Guía
                                        </button>

                                        {/* Date */}
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <CalendarDays className="h-3 w-3" />
                                            {new Date(pedido.created_at).toLocaleDateString('es-BO')}
                                        </div>

                                        {/* Reserve products badge */}
                                        <button className="flex w-full items-center justify-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white hover:bg-purple-700">
                                            <PackageCheck className="h-3 w-3" />
                                            Reservar Productos
                                        </button>

                                        {/* Product vinculators */}
                                        {!isPago && (
                                            <>
                                                {pedido.productos.map((pp) => {
                                                    const ext = productosResueltos[pp.id_producto];
                                                    const vinculado = imagenPedido.productos_vinculados.some(
                                                        (v) => v.id_pedido_producto === pp.id,
                                                    );
                                                    return (
                                                        <div
                                                            key={pp.id}
                                                            className="flex items-center gap-1.5"
                                                        >
                                                            <span
                                                                className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold text-white ${vinculado ? 'bg-green-500' : 'bg-blue-600'}`}
                                                            >
                                                                <ShoppingCart className="h-3 w-3" />
                                                                Producto ×{pp.cantidad}
                                                            </span>
                                                            <button
                                                                onClick={() => handleOpenModal(imagenPedido, 'producto')}
                                                                className="flex flex-1 items-center justify-center gap-1 rounded border border-blue-300 px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                {ext?.nombre ?? 'Agregar Producto'}
                                                            </button>
                                                        </div>
                                                    );
                                                })}

                                                {/* Empty slot to add product */}
                                                <button
                                                    onClick={() => handleOpenModal(imagenPedido, 'producto')}
                                                    className="flex w-full items-center justify-center gap-1 rounded border border-dashed border-blue-300 px-2 py-1 text-xs text-blue-500 hover:bg-blue-50"
                                                >
                                                    <Plus className="h-3 w-3" /> Agregar Producto
                                                </button>
                                            </>
                                        )}

                                        {/* Payment comprobante */}
                                        {isPago && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="flex items-center gap-1 rounded bg-yellow-500 px-2 py-0.5 text-xs font-semibold text-white">
                                                    💳 Comprobante
                                                </span>
                                                <button
                                                    onClick={() => handleOpenModal(imagenPedido, 'pago')}
                                                    className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-blue-700"
                                                >
                                                    🔗 Vincular
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </td>

                {/* ── Estado badge ─────────────────────────────────────── */}
                <td className="border-r border-gray-200 px-3 py-3 text-center">
                    <span
                        className={`inline-block rounded px-2.5 py-1 text-xs font-bold text-white ${badgeColor}`}
                    >
                        {pedido.estado_pedido}
                    </span>
                </td>

                {/* ── Acciones ─────────────────────────────────────────── */}
                <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1.5">
                        {/* Nota label */}
                        <span className="text-[10px] text-gray-400">
                            {tienaNota ? `Nota x${pedido.recibos[0].cantidad}` : 'Sin generar nota'}
                        </span>

                        {/* Edit */}
                        <button
                            onClick={() => router.visit(route('pedidos.show', pedido.id))}
                            className="flex h-7 w-16 items-center justify-center gap-1 rounded bg-blue-500 text-xs text-white hover:bg-blue-600"
                            title="Editar"
                        >
                            <Pencil className="h-3 w-3" />
                        </button>

                        {/* Print note */}
                        <button
                            className="flex h-7 w-16 items-center justify-center gap-1 rounded bg-gray-500 text-xs text-white hover:bg-gray-600"
                            title="Imprimir nota"
                        >
                            <ClipboardList className="h-3 w-3" />
                        </button>

                        {/* Complete */}
                        <button
                            onClick={handleCompletar}
                            className="flex h-7 w-16 items-center justify-center gap-1 rounded bg-green-500 text-xs text-white hover:bg-green-600"
                            title="Completar"
                        >
                            <CheckCircle className="h-3 w-3" />
                        </button>

                        {/* Anular */}
                        <button
                            onClick={handleAnular}
                            className="flex h-7 w-16 items-center justify-center gap-1 rounded bg-orange-400 text-xs text-white hover:bg-orange-500"
                            title="Anular"
                        >
                            <ShieldX className="h-3 w-3" />
                        </button>

                        {/* Delete */}
                        <button
                            onClick={handleEliminar}
                            className="flex h-7 w-16 items-center justify-center gap-1 rounded bg-red-500 text-xs text-white hover:bg-red-600"
                            title="Eliminar"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* ── Modal ─────────────────────────────────────────────── */}
            {selectedImagen && (
                <ImagenVinculadorModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedImagen(null);
                    }}
                    imagenPedido={selectedImagen}
                    pedido={pedido}
                    productosResueltos={productosResueltos}
                    mode={modalMode}
                />
            )}
        </>
    );
}

