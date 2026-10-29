import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Boxes, Warehouse, CheckCircle2 } from 'lucide-react';
import type { ExternalProducto, ExternalSucursal, PedidoCatalogo } from '@/types/pedidos';

interface ReservaManualDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cuaderno: PedidoCatalogo | null;
    productosResueltos: Record<number, ExternalProducto>;
    sucursalesResueltas: Record<number, ExternalSucursal>;
    onConfirmReserva?: (productoId: number, sucursalIds: number[]) => void;
}

export default function ReservaManualDialog({
    isOpen,
    onClose,
    cuaderno,
    productosResueltos,
    sucursalesResueltas,
    onConfirmReserva,
}: ReservaManualDialogProps) {
    const [selectedProductoIndex, setSelectedProductoIndex] = useState<number>(0);
    const [selectedSucursales, setSelectedSucursales] = useState<number[]>([1]);

    const productos = cuaderno?.productos ?? [];
    const activeProducto = productos[selectedProductoIndex] ?? null;
    const resolvedProd = activeProducto ? productosResueltos[activeProducto.id_producto] : null;

    const toggleSucursal = (id: number) => {
        setSelectedSucursales((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        if (!activeProducto) return;
        if (onConfirmReserva) {
            onConfirmReserva(activeProducto.id, selectedSucursales);
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl rounded-2xl">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                        <Boxes className="size-4 text-purple-600" />
                        Reserva Manual de Stock — Pedido #{cuaderno?.id}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-2">
                    {/* ── Left Column: Products in order ──────────────────── */}
                    <div className="md:col-span-5 space-y-2 border-r pr-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Productos del Pedido ({productos.length}):
                        </span>
                        <div className="space-y-1.5 max-h-64 overflow-y-auto">
                            {productos.map((prod, idx) => {
                                const info = productosResueltos[prod.id_producto];
                                const isSelected = idx === selectedProductoIndex;
                                return (
                                    <button
                                        key={prod.id}
                                        type="button"
                                        onClick={() => setSelectedProductoIndex(idx)}
                                        className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                                            isSelected
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-xs'
                                                : 'hover:bg-muted/50 border-muted'
                                        }`}
                                    >
                                        <div className="flex-1 pr-2">
                                            <p className="text-xs font-bold text-foreground leading-tight">
                                                {info?.nombre ?? `Producto #${prod.id_producto}`}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Cantidad: ×{prod.cantidad}
                                            </p>
                                        </div>
                                        <Badge variant={prod.estado === 'reservado' ? 'default' : 'secondary'} className="text-[10px]">
                                            {prod.estado}
                                        </Badge>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right Column: Branches and Stock ────────────────── */}
                    <div className="md:col-span-7 space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Sucursales Activas y Disponibilidad:
                        </span>

                        {activeProducto ? (
                            <div className="space-y-2">
                                <div className="rounded-xl border bg-muted/30 p-2.5 text-xs">
                                    <span className="font-semibold text-foreground">Seleccionado: </span>
                                    <span>{resolvedProd?.nombre ?? `Producto #${activeProducto.id_producto}`}</span>
                                    <span className="ml-2 font-bold text-purple-600">(Req: {activeProducto.cantidad} und.)</span>
                                </div>

                                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                                    {Object.values(sucursalesResueltas).map((sucursal) => {
                                        const isChecked = selectedSucursales.includes(sucursal.id);
                                        return (
                                            <label
                                                key={sucursal.id}
                                                className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                                                    isChecked
                                                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                                                        : 'hover:bg-muted/50 border-muted'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => toggleSucursal(sucursal.id)}
                                                        className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground leading-tight">
                                                            {sucursal.nombre}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {sucursal.ciudad} — {sucursal.direccion}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                                                    Stock: 12
                                                </Badge>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground py-10 text-center">
                                Seleccione un producto para ver las sucursales.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t pt-3 flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                        Cerrar
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        disabled={selectedSucursales.length === 0}
                        onClick={handleConfirm}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
                    >
                        <CheckCircle2 className="mr-1.5 size-3.5" />
                        Reservar en Sucursal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

