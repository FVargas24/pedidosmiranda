import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Plus, DollarSign } from 'lucide-react';
import type { ExternalProducto, PedidoCatalogo } from '@/types/pedidos';

interface AgregarProductoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cuaderno: PedidoCatalogo | null;
    imagenId?: number | null;
    productosResueltos: Record<number, ExternalProducto>;
    onSave?: (data: {
        cuaderno_id: number;
        producto_id: number;
        cantidad: number;
        precio_venta: number;
        imagen_id?: number | null;
    }) => void;
}

export default function AgregarProductoDialog({
    isOpen,
    onClose,
    cuaderno,
    imagenId,
    productosResueltos,
    onSave,
}: AgregarProductoDialogProps) {
    const [selectedProductoId, setSelectedProductoId] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(1);
    const [precioVenta, setPrecioVenta] = useState<string>('');

    // Pre-populate price when product is selected
    useEffect(() => {
        if (selectedProductoId && productosResueltos[Number(selectedProductoId)]) {
            const prod = productosResueltos[Number(selectedProductoId)];
            setPrecioVenta(prod.precio.toFixed(2));
        }
    }, [selectedProductoId, productosResueltos]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cuaderno || !selectedProductoId) return;

        if (onSave) {
            onSave({
                cuaderno_id: cuaderno.id,
                producto_id: Number(selectedProductoId),
                cantidad: Number(cantidad) || 1,
                precio_venta: parseFloat(precioVenta) || 0,
                imagen_id: imagenId,
            });
        }
        onClose();
    };

    const subtotal = (Number(cantidad) || 0) * (parseFloat(precioVenta) || 0);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                        <ShoppingCart className="size-4 text-purple-600" />
                        Agregar Producto al Pedido #{cuaderno?.id}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* ── Product Select ──────────────────────────────────── */}
                    <div className="space-y-1.5">
                        <Label htmlFor="producto-select" className="text-xs font-semibold">
                            Seleccionar Producto
                        </Label>
                        <Select value={selectedProductoId} onValueChange={setSelectedProductoId}>
                            <SelectTrigger id="producto-select" className="h-10 text-xs">
                                <SelectValue placeholder="Seleccione un producto del catálogo..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                <SelectGroup>
                                    {Object.values(productosResueltos).map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)} className="text-xs">
                                            {p.nombre} ({p.codigo}) — Bs. {p.precio.toFixed(2)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* ── Cantidad ────────────────────────────────────────── */}
                        <div className="space-y-1.5">
                            <Label htmlFor="cantidad-input" className="text-xs font-semibold">
                                Cantidad
                            </Label>
                            <Input
                                id="cantidad-input"
                                type="number"
                                min={1}
                                value={cantidad}
                                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                required
                                className="h-10 text-xs"
                            />
                        </div>

                        {/* ── Precio Venta ────────────────────────────────────── */}
                        <div className="space-y-1.5">
                            <Label htmlFor="precio-input" className="text-xs font-semibold">
                                Precio Venta (Bs.)
                            </Label>
                            <div className="relative">
                                <DollarSign className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                                <Input
                                    id="precio-input"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={precioVenta}
                                    onChange={(e) => setPrecioVenta(e.target.value)}
                                    required
                                    placeholder="0.00"
                                    className="h-10 pl-8 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Subtotal Preview ────────────────────────────────── */}
                    <div className="rounded-xl border bg-muted/40 p-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">Subtotal Estimado:</span>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                            Bs. {subtotal.toFixed(2)}
                        </span>
                    </div>

                    <DialogFooter className="border-t pt-3 flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                            Cerrar
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!selectedProductoId}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
                        >
                            <Plus className="mr-1 size-3.5" />
                            Guardar Producto
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

