import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    History,
    ClipboardList,
    Receipt,
    Eraser,
    Truck,
    Printer,
    FileText,
    Download,
    ArrowRightLeft,
    Layers,
} from 'lucide-react';
import type { CuadernoFilterType } from '@/types/pedidos';

interface CuadernosDashboardCardsProps {
    activeFilter: CuadernoFilterType;
    selectedCount: number;
    onConfirmarBCP?: () => void;
    onVerPdfsAnteriores?: () => void;
    onResumenRespaldo?: () => void;
    onNotaVenta?: () => void;
    onClearSelection?: () => void;
    onMarkAsSent?: () => void;
    onPrintAllAndPack?: () => void;
    onReporteFichas?: () => void;
    onDescargarReporteSumarizado?: () => void;
    onPendientesToListos?: () => void;
    onJuntarPedidos?: () => void;
}

export default function CuadernosDashboardCards({
    activeFilter,
    selectedCount,
    onConfirmarBCP,
    onVerPdfsAnteriores,
    onResumenRespaldo,
    onNotaVenta,
    onClearSelection,
    onMarkAsSent,
    onPrintAllAndPack,
    onReporteFichas,
    onDescargarReporteSumarizado,
    onPendientesToListos,
    onJuntarPedidos,
}: CuadernosDashboardCardsProps) {
    const isListosOEmpaque = activeFilter === 'listos' || activeFilter === 'empemb';
    const isImprimiendo = activeFilter === 'imprimiendo';
    const isPendientes = activeFilter === 'pendientes';
    const isRepetidos = activeFilter === 'repetidos';

    if (!isListosOEmpaque && !isImprimiendo && !isPendientes && !isRepetidos) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 py-1">
            {/* ── Listos o Empaquetado Actions ────────────────────────────── */}
            {isListosOEmpaque && (
                <>
                    <Button
                        type="button"
                        onClick={onConfirmarBCP}
                        className="h-24 w-36 flex-col gap-1.5 rounded-2xl bg-amber-500 font-bold text-neutral-900 shadow-md hover:bg-amber-600 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <CheckCircle className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Confirmar Resumen BCP</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onVerPdfsAnteriores}
                        className="h-24 w-36 flex-col gap-1.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 font-bold text-white shadow-md hover:brightness-110 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <History className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Ver PDFs Anteriores</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onResumenRespaldo}
                        className="h-24 w-36 flex-col gap-1.5 rounded-2xl bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <ClipboardList className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Resumen BCP Respaldo</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onNotaVenta}
                        className="h-24 w-36 flex-col gap-1.5 rounded-2xl bg-blue-600 font-bold text-white shadow-md hover:bg-blue-700 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <Receipt className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Nota de Venta</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onClearSelection}
                        disabled={selectedCount === 0}
                        className="h-24 w-36 flex-col gap-1.5 rounded-2xl bg-orange-600 font-bold text-white shadow-md hover:bg-orange-700 disabled:opacity-50 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <Eraser className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">
                            Limpiar Selección {selectedCount > 0 && `(${selectedCount})`}
                        </span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onMarkAsSent}
                        disabled={selectedCount === 0}
                        className="h-24 w-36 flex-col gap-1.5 rounded-2xl bg-sky-600 font-bold text-white shadow-md hover:bg-sky-700 disabled:opacity-50 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <Truck className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Marcar como Enviados</span>
                    </Button>
                </>
            )}

            {/* ── Imprimiendo Actions ────────────────────────────────────── */}
            {isImprimiendo && (
                <>
                    <Button
                        type="button"
                        onClick={onPrintAllAndPack}
                        className="h-24 w-40 flex-col gap-1.5 rounded-2xl bg-blue-600 font-bold text-white shadow-md hover:bg-blue-700 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <Printer className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Imprimir Fichas</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onReporteFichas}
                        className="h-24 w-40 flex-col gap-1.5 rounded-2xl bg-rose-600 font-bold text-white shadow-md hover:bg-rose-700 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <FileText className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Reporte Fichas Pedido</span>
                    </Button>
                </>
            )}

            {/* ── Pendientes Actions ─────────────────────────────────────── */}
            {isPendientes && (
                <>
                    <Button
                        type="button"
                        onClick={onDescargarReporteSumarizado}
                        className="h-24 w-44 flex-col gap-1.5 rounded-2xl bg-rose-600 font-bold text-white shadow-md hover:bg-rose-700 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <Download className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Descargar Reporte Sumarizado</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={onPendientesToListos}
                        className="h-24 w-44 flex-col gap-1.5 rounded-2xl bg-amber-500 font-bold text-neutral-900 shadow-md hover:bg-amber-600 transition-transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <ArrowRightLeft className="size-6 mb-0.5" />
                        <span className="text-center text-xs leading-tight">Pasar Pendientes a Listos</span>
                    </Button>
                </>
            )}

            {/* ── Repetidos Actions ──────────────────────────────────────── */}
            {isRepetidos && (
                <Button
                    type="button"
                    onClick={onJuntarPedidos}
                    disabled={selectedCount < 2}
                    className="h-24 w-44 flex-col gap-1.5 rounded-2xl bg-purple-600 font-bold text-white shadow-md hover:bg-purple-700 disabled:opacity-50 transition-transform hover:-translate-y-1 active:translate-y-0"
                >
                    <Layers className="size-6 mb-0.5" />
                    <span className="text-center text-xs leading-tight">
                        Juntar Pedidos {selectedCount >= 2 && `(${selectedCount})`}
                    </span>
                </Button>
            )}
        </div>
    );
}

