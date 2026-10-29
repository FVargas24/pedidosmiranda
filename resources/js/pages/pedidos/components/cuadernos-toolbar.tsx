import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, X, Eye } from 'lucide-react';
import type { CuadernoFilterType } from '@/types/pedidos';
import { FILTER_INFOS } from '../hooks/use-cuadernos-table';

interface CuadernosToolbarProps {
    totalRegistros: number;
    fechaFiltro: string;
    onFechaFiltroChange: (date: string) => void;
    onClearFechaFiltro: () => void;
    activeFilter: CuadernoFilterType;
    onFilterChange: (filter: CuadernoFilterType) => void;
}

export default function CuadernosToolbar({
    totalRegistros,
    fechaFiltro,
    onFechaFiltroChange,
    onClearFechaFiltro,
    activeFilter,
    onFilterChange,
}: CuadernosToolbarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            {/* ── Total Registros Badge ───────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <Badge
                    variant="secondary"
                    className="h-8 px-3 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200"
                >
                    Total registros: <span className="ml-1 text-sm">{totalRegistros}</span>
                </Badge>
            </div>

            {/* ── Date Filter Input ───────────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Calendar className="size-4 text-purple-600" />
                    <span>Filtrar Fecha:</span>
                </div>

                <div className="relative flex items-center">
                    <Input
                        type="date"
                        value={fechaFiltro}
                        onChange={(e) => onFechaFiltroChange(e.target.value)}
                        className="h-9 w-44 rounded-l-md rounded-r-none border-r-0 text-xs font-medium bg-background"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onClearFechaFiltro}
                        disabled={!fechaFiltro}
                        className="h-9 w-8 rounded-l-none rounded-r-md border-l-0 text-muted-foreground hover:text-destructive"
                        title="Limpiar fecha"
                    >
                        <X className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* ── Quick Switch Filter View ────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Eye className="size-4 text-purple-600" />
                    <span>Cambiar Vista:</span>
                </div>

                <Select value={activeFilter} onValueChange={(val) => onFilterChange(val as CuadernoFilterType)}>
                    <SelectTrigger className="h-9 w-52 text-xs font-medium">
                        <SelectValue placeholder="Seleccionar vista" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.values(FILTER_INFOS).map((info) => (
                                <SelectItem key={info.id} value={info.id} className="text-xs">
                                    {info.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

