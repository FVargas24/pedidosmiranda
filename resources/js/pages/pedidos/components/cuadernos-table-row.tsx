import { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Phone,
    Plus,
    Link2,
    Camera,
    MessageSquare,
    Boxes,
    CheckCircle2,
    Trash2,
    Eye,
    Receipt,
    Pencil,
    Check,
} from 'lucide-react';
import type {
    CuadernoFilterType,
    ExternalProducto,
    ExternalSucursal,
    ImagenPedido,
    PedidoCatalogo,
} from '@/types/pedidos';

interface CuadernosTableRowProps {
    pedido: PedidoCatalogo;
    productosResueltos: Record<number, ExternalProducto>;
    sucursalesResueltas: Record<number, ExternalSucursal>;
    activeFilter: CuadernoFilterType;
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
    toggles: { la_paz: boolean; enviado: boolean; p_listo: boolean; p_pendiente: boolean };
    onToggleField: (id: number, field: 'la_paz' | 'enviado' | 'p_listo' | 'p_pendiente') => void;
    onOpenAgregarProducto: (pedido: PedidoCatalogo, imagenId?: number) => void;
    onOpenVincularPago: (pedido: PedidoCatalogo, imagenId?: number) => void;
    onOpenGuia: (pedido: PedidoCatalogo) => void;
    onOpenWhatsApp: (pedido: PedidoCatalogo) => void;
    onOpenLightbox: (url: string, caption: string) => void;
    onOpenReservaManual: (pedido: PedidoCatalogo) => void;
}

const ESTADO_BADGE_VARIANTS: Record<string, string> = {
    Pendiente: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300',
    'En proceso': 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300',
    Listo: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300',
    Enviado: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-300',
    Completado: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300',
    Anulado: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-300',
};

export default function CuadernosTableRow({
    pedido,
    productosResueltos,
    sucursalesResueltas,
    activeFilter,
    isSelected,
    onToggleSelect,
    toggles,
    onToggleField,
    onOpenAgregarProducto,
    onOpenVincularPago,
    onOpenGuia,
    onOpenWhatsApp,
    onOpenLightbox,
    onOpenReservaManual,
}: CuadernosTableRowProps) {
    const [isEditingDetalle, setIsEditingDetalle] = useState(false);
    const [detalleValue, setDetalleValue] = useState(pedido.detalle ?? '');

    const isSelectableFilter =
        activeFilter === 'listos' || activeFilter === 'empemb' || activeFilter === 'repetidos';

    const cliente = pedido.cliente;
    const destino = pedido.destino;
    const isEnviado = toggles.enviado || pedido.estado_pedido === 'Enviado';

    return (
        <TableRow
            className={`transition-colors border-b text-xs ${
                isEnviado
                    ? 'bg-emerald-50/70 hover:bg-emerald-50 dark:bg-emerald-950/20'
                    : isSelected
                      ? 'bg-purple-50/50 dark:bg-purple-950/20'
                      : 'hover:bg-muted/40'
            }`}
        >
            {/* ── Selection Checkbox ───────────────────────────────────────── */}
            {isSelectableFilter && (
                <TableCell className="text-center w-10 p-2">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(pedido.id)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                </TableCell>
            )}

            {/* ── # ID ────────────────────────────────────────────────────── */}
            <TableCell className="text-center font-bold text-foreground w-12 p-2">
                #{pedido.id}
            </TableCell>

            {/* ── La Paz (Cyan) ────────────────────────────────────────────── */}
            <TableCell className="text-center w-12 p-1">
                <Checkbox
                    checked={toggles.la_paz}
                    onCheckedChange={() => onToggleField(pedido.id, 'la_paz')}
                    className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
            </TableCell>

            {/* ── Enviado (Green) ──────────────────────────────────────────── */}
            <TableCell className="text-center w-12 p-1">
                <Checkbox
                    checked={toggles.enviado}
                    onCheckedChange={() => onToggleField(pedido.id, 'enviado')}
                    className="border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
            </TableCell>

            {/* ── P. Listo (Yellow) ────────────────────────────────────────── */}
            <TableCell className="text-center w-12 p-1">
                <Checkbox
                    checked={toggles.p_listo}
                    onCheckedChange={() => onToggleField(pedido.id, 'p_listo')}
                    className="border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
            </TableCell>

            {/* ── P. Pendiente (Red) ───────────────────────────────────────── */}
            <TableCell className="text-center w-12 p-1">
                <Checkbox
                    checked={toggles.p_pendiente}
                    onCheckedChange={() => onToggleField(pedido.id, 'p_pendiente')}
                    className="border-rose-500 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                />
            </TableCell>

            {/* ── Información Personal ─────────────────────────────────────── */}
            <TableCell className="min-w-[210px] p-2.5 text-left">
                {cliente ? (
                    <div className="space-y-1">
                        <p className="font-bold uppercase text-foreground leading-tight text-xs">
                            {cliente.nombre}
                        </p>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <span className="font-semibold text-foreground">CI:</span>
                            <span>{cliente.ci}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="font-semibold text-foreground">Cel:</span>
                                <span>{cliente.celular}</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => onOpenWhatsApp(pedido)}
                                className="h-6 w-6 rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Notificar por WhatsApp"
                            >
                                <Phone className="size-3" />
                            </Button>
                        </div>

                        {/* Inline observations/detalle */}
                        <div className="mt-1.5 pt-1 border-t border-muted/50">
                            {isEditingDetalle ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={detalleValue}
                                        onChange={(e) => setDetalleValue(e.target.value)}
                                        className="h-6 text-[11px] rounded border px-1.5 flex-1 bg-background"
                                        placeholder="Observaciones..."
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="h-6 w-6 bg-purple-600 hover:bg-purple-700 text-white"
                                        onClick={() => setIsEditingDetalle(false)}
                                    >
                                        <Check className="size-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsEditingDetalle(true)}
                                    className="text-[11px] text-muted-foreground italic cursor-pointer hover:text-purple-600 hover:underline flex items-center justify-between gap-1 group"
                                    title="Haga clic para editar detalle"
                                >
                                    <span className="truncate max-w-[180px]">
                                        {detalleValue || '— Sin notas'}
                                    </span>
                                    <Pencil className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <span className="text-muted-foreground">Sin cliente</span>
                )}
            </TableCell>

            {/* ── Depto / Prov ─────────────────────────────────────────────── */}
            <TableCell className="min-w-[130px] p-2 text-center">
                {destino ? (
                    <div className="space-y-1">
                        <Badge variant="outline" className="font-bold bg-muted/60 text-xs text-foreground">
                            {destino.departamento?.nombre_dep ?? '—'}
                        </Badge>
                        <p className="text-[11px] text-muted-foreground">
                            {destino.provincia?.nombre_prov ?? '—'}
                        </p>
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                            {destino.tipo_destino}
                        </Badge>
                        {pedido.sucursal_recojo_id && sucursalesResueltas[pedido.sucursal_recojo_id] && (
                            <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 leading-tight">
                                🏬 {sucursalesResueltas[pedido.sucursal_recojo_id].nombre}
                            </p>
                        )}
                    </div>
                ) : (
                    <span className="text-muted-foreground">Sin destino</span>
                )}
            </TableCell>

            {/* ── Productos del Pedido ─────────────────────────────────────── */}
            <TableCell className="min-w-[260px] p-2 text-left">
                <div className="space-y-1.5">
                    {pedido.productos.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground italic">Sin productos</span>
                    ) : (
                        pedido.productos.map((prod) => {
                            const info = productosResueltos[prod.id_producto];
                            return (
                                <div
                                    key={prod.id}
                                    className="flex items-center justify-between rounded-lg border-l-4 border-l-purple-600 bg-muted/30 p-1.5 text-[11px]"
                                >
                                    <div className="flex-1 pr-1 truncate">
                                        <p className="font-semibold text-foreground truncate">
                                            {info?.nombre ?? `Producto #${prod.id_producto}`}
                                        </p>
                                        <p className="text-muted-foreground text-[10px]">
                                            Bs. {parseFloat(prod.precio_venta).toFixed(2)} c/u
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="font-bold text-[11px]">
                                        ×{prod.cantidad}
                                    </Badge>
                                </div>
                            );
                        })
                    )}
                </div>
            </TableCell>

            {/* ── Imágenes y Comprobantes ─────────────────────────────────── */}
            <TableCell className="min-w-[130px] p-2 text-center">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {pedido.imagenes.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground italic">Sin imágenes</span>
                    ) : (
                        pedido.imagenes.map((img) => (
                            <div
                                key={img.id}
                                onClick={() =>
                                    img.imagen?.url &&
                                    onOpenLightbox(img.imagen.url, `${img.tipo.toUpperCase()} — PEDIDO #${pedido.id}`)
                                }
                                className="group relative size-10 rounded-lg overflow-hidden border cursor-pointer shadow-xs hover:ring-2 hover:ring-purple-500 transition-all"
                                title={`Ver ${img.tipo}`}
                            >
                                {img.imagen?.url ? (
                                    <img
                                        src={img.imagen.url}
                                        alt={img.tipo}
                                        className="size-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="size-full bg-muted flex items-center justify-center text-[10px]">
                                        {img.tipo}
                                    </div>
                                )}
                                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white font-bold text-center leading-none py-0.5 uppercase">
                                    {img.tipo === 'pago' ? 'Pago' : 'Prod'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </TableCell>

            {/* ── Estado ─────────────────────────────────────────────────── */}
            <TableCell className="text-center p-2">
                <Badge
                    variant="outline"
                    className={`font-bold uppercase text-[11px] px-2.5 py-0.5 rounded-full ${
                        ESTADO_BADGE_VARIANTS[pedido.estado_pedido] ?? 'bg-muted'
                    }`}
                >
                    {pedido.estado_pedido}
                </Badge>
            </TableCell>

            {/* ── Acciones ───────────────────────────────────────────────── */}
            <TableCell className="text-center p-2 w-14">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Acciones</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuItem onClick={() => onOpenAgregarProducto(pedido)}>
                            <Plus className="mr-2 size-3.5 text-purple-600" /> Agregar Producto
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenVincularPago(pedido, pedido.imagenes[0]?.id)}>
                            <Link2 className="mr-2 size-3.5 text-blue-600" /> Vincular Pago
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenGuia(pedido)}>
                            <Camera className="mr-2 size-3.5 text-emerald-600" /> Gestión de Guía
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenReservaManual(pedido)}>
                            <Boxes className="mr-2 size-3.5 text-amber-600" /> Reserva de Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenWhatsApp(pedido)}>
                            <MessageSquare className="mr-2 size-3.5 text-emerald-600" /> Notificar WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
                            <Trash2 className="mr-2 size-3.5" /> Eliminar Pedido
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

