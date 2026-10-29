import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Filter,
    FileText,
    Warehouse,
    Search,
    Hash,
    Layers,
    MapPin,
    Truck,
    CheckCircle2,
    Clock,
    Box,
    Printer,
    Package,
    PhoneOff,
} from 'lucide-react';
import type { FilterInfo } from '../hooks/use-cuadernos-table';

interface CuadernosFilterHeaderProps {
    filterInfo: FilterInfo;
    search: string;
    onSearchChange: (value: string) => void;
    searchId: string;
    onSearchIdChange: (value: string) => void;
    selectedDeptosCount: number;
    onOpenFiltrosDeptos: () => void;
    onReporteRecojos?: () => void;
    onReporteFiltrado?: () => void;
    onReportePedido?: () => void;
    onOpenAlmacen?: () => void;
}

const FILTER_ICONS: Record<string, React.ElementType> = {
    todos: Layers,
    la_paz: MapPin,
    enviados: Truck,
    listos: CheckCircle2,
    pendientes: Clock,
    recojo: Box,
    liquidacion: Box,
    imprimiendo: Printer,
    empemb: Package,
    repetidos: PhoneOff,
};

export default function CuadernosFilterHeader({
    filterInfo,
    search,
    onSearchChange,
    searchId,
    onSearchIdChange,
    selectedDeptosCount,
    onOpenFiltrosDeptos,
    onReporteRecojos,
    onReporteFiltrado,
    onReportePedido,
    onOpenAlmacen,
}: CuadernosFilterHeaderProps) {
    const IconComponent = FILTER_ICONS[filterInfo.id] ?? Layers;

    return (
        <div
            className={`rounded-2xl border p-4 shadow-sm transition-all duration-200 ${filterInfo.bgClass} ${filterInfo.borderClass}`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* ── Title and Filter Context ────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <div
                        className="flex size-11 items-center justify-center rounded-xl shadow-xs"
                        style={{ backgroundColor: filterInfo.color, color: '#fff' }}
                    >
                        <IconComponent className="size-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                {filterInfo.title}
                            </h1>
                            <Badge className={filterInfo.badgeClass}>
                                Vista Activa
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {filterInfo.description}
                        </p>
                    </div>
                </div>

                {/* ── Action Buttons Group ───────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant={selectedDeptosCount > 0 ? 'default' : 'outline'}
                        className={`rounded-full px-4 text-xs font-semibold shadow-xs ${
                            selectedDeptosCount > 0
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-background hover:bg-muted'
                        }`}
                        onClick={onOpenFiltrosDeptos}
                    >
                        <Filter className="mr-1.5 size-3.5" />
                        {selectedDeptosCount > 0
                            ? `${selectedDeptosCount} Deptos. selec.`
                            : 'Filtros'}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-300 hover:bg-amber-500/25 px-4 text-xs font-semibold shadow-xs"
                        onClick={onReporteRecojos}
                    >
                        <FileText className="mr-1.5 size-3.5 text-amber-600" />
                        PDF Recojos Tienda
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-sky-500/15 text-sky-900 dark:text-sky-300 border-sky-300 hover:bg-sky-500/25 px-4 text-xs font-semibold shadow-xs"
                        onClick={onReporteFiltrado}
                    >
                        <FileText className="mr-1.5 size-3.5 text-sky-600" />
                        Reporte
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-rose-500/15 text-rose-900 dark:text-rose-300 border-rose-300 hover:bg-rose-500/25 px-4 text-xs font-semibold shadow-xs"
                        onClick={onReportePedido}
                    >
                        <FileText className="mr-1.5 size-3.5 text-rose-600" />
                        Reporte Pedido
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-purple-500/15 text-purple-900 dark:text-purple-300 border-purple-300 hover:bg-purple-500/25 px-4 text-xs font-semibold shadow-xs"
                        onClick={onOpenAlmacen}
                    >
                        <Warehouse className="mr-1.5 size-3.5 text-purple-600" />
                        Almacén
                    </Button>
                </div>
            </div>

            {/* ── Search Bars ────────────────────────────────────────────── */}
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="relative md:col-span-8">
                    <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar ID, Cliente, CI, Celular o Ubicación..."
                        className="h-10 rounded-full bg-background pl-10 text-sm shadow-xs border-muted-foreground/20 focus-visible:ring-purple-600"
                    />
                </div>

                <div className="relative md:col-span-4">
                    <Hash className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                    <Input
                        type="text"
                        value={searchId}
                        onChange={(e) => onSearchIdChange(e.target.value)}
                        placeholder="Buscar solo por ID..."
                        className="h-10 rounded-full bg-background pl-10 text-sm shadow-xs border-muted-foreground/20 focus-visible:ring-purple-600"
                    />
                </div>
            </div>
        </div>
    );
}

