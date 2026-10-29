import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Link2, Search, CreditCard, Clock, Fingerprint } from 'lucide-react';
import type { PedidoCatalogo } from '@/types/pedidos';

interface VincularPagoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cuaderno: PedidoCatalogo | null;
    imagenId?: number | null;
    onVincular?: (data: { cuadernoId: number; imagenId: number; movimientoIds: number[] }) => void;
}

// Sample mock movements for rich UI preview matching database/data/movimientos_pago.json
const MOCK_MOVIMIENTOS = [
    { id: 1001, monto: 150.0, fecha: '2026-10-25 10:30', descripcion: 'Transferencia QR Simple - Banco Unión (Ref. 49210)', secuencia: 'QR-49210', match: 'nombre' },
    { id: 1002, monto: 320.0, fecha: '2026-10-25 14:15', descripcion: 'Transferencia Móvil BCP - Ref. #88921', secuencia: 'BCP-88921', match: 'monto' },
    { id: 1003, monto: 210.5, fecha: '2026-10-26 09:40', descripcion: 'Depósito en Ventanilla BNB - Ag. Equipetrol', secuencia: 'BNB-103', match: 'manual' },
    { id: 1004, monto: 85.0, fecha: '2026-10-26 16:50', descripcion: 'Pago QR Simple - Banco Mercantil Santa Cruz', secuencia: 'BMSC-404', match: 'monto' },
    { id: 1005, monto: 95.0, fecha: '2026-10-27 11:20', descripcion: 'Billetera Móvil Tigo Money - Trans. #77210', secuencia: 'TM-77210', match: 'manual' },
];

export default function VincularPagoDialog({
    isOpen,
    onClose,
    cuaderno,
    imagenId,
    onVincular,
}: VincularPagoDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovimientoIds, setSelectedMovimientoIds] = useState<number[]>([]);

    const clienteNombre = cuaderno?.cliente?.nombre ?? 'Cliente no asignado';
    const totalPedido = cuaderno?.productos?.reduce(
        (acc, p) => acc + (parseFloat(p.precio_venta) || 0) * (p.cantidad || 1),
        0
    ) ?? 0;

    const toggleSelect = (id: number) => {
        setSelectedMovimientoIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        if (!cuaderno || !imagenId || selectedMovimientoIds.length === 0) return;
        if (onVincular) {
            onVincular({
                cuadernoId: cuaderno.id,
                imagenId: imagenId,
                movimientoIds: selectedMovimientoIds,
            });
        }
        onClose();
    };

    const filteredMovimientos = MOCK_MOVIMIENTOS.filter((m) =>
        m.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.id).includes(searchTerm) ||
        String(m.monto).includes(searchTerm)
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                        <Link2 className="size-4 text-purple-600" />
                        Vincular Comprobante de Pago al Pedido #{cuaderno?.id}
                    </DialogTitle>
                </DialogHeader>

                {/* ── Client & Order Info Banner ──────────────────────────── */}
                <div className="rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/30 p-3 text-xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-muted-foreground">Cliente: </span>
                            <span className="font-bold text-sky-900 dark:text-sky-300 uppercase">{clienteNombre}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Total Pedido: </span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                Bs. {totalPedido.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Search Movement ─────────────────────────────────────── */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Buscar Movimiento Bancario:
                    </label>
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por descripción, referencia o monto..."
                            className="h-9 pl-9 text-xs"
                        />
                    </div>
                </div>

                {/* ── Movements List ──────────────────────────────────────── */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Pagos Disponibles / Sugeridos:
                    </span>

                    <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl border p-2">
                        {filteredMovimientos.map((mov) => {
                            const isChecked = selectedMovimientoIds.includes(mov.id);
                            return (
                                <div
                                    key={mov.id}
                                    onClick={() => toggleSelect(mov.id)}
                                    className={`flex items-start gap-3 rounded-xl border p-2.5 transition-all cursor-pointer ${
                                        isChecked
                                            ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/30 shadow-xs'
                                            : 'hover:bg-muted/50 border-muted'
                                    }`}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => toggleSelect(mov.id)}
                                        className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                                Bs. {mov.monto.toFixed(2)}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] ${
                                                    mov.match === 'nombre'
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                        : 'bg-blue-100 text-blue-800 border-blue-300'
                                                }`}
                                            >
                                                {mov.match === 'nombre' ? 'COINCIDENCIA NOMBRE' : 'MONTO EXACTO'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-medium text-foreground leading-tight">
                                            {mov.descripcion}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-muted/60">
                                            <span className="flex items-center gap-1">
                                                <Fingerprint className="size-3" /> Ref: {mov.secuencia}
                                            </span>
                                            <span className="flex items-center gap-1 font-semibold text-primary">
                                                <Clock className="size-3" /> {mov.fecha}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between border-t pt-3 sm:justify-between">
                    <span className="text-xs text-muted-foreground">
                        {selectedMovimientoIds.length} seleccionado(s)
                    </span>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={selectedMovimientoIds.length === 0}
                            onClick={handleConfirm}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
                        >
                            <CreditCard className="mr-1.5 size-3.5" />
                            Vincular Seleccionados
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

